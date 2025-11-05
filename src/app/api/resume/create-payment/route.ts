import { NextRequest, NextResponse } from 'next/server';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { PaymentService } from '~/lib/payments';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, amount, currency = 'USD' } = body;

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }

    // Verify resume belongs to user
    const resume = await db.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Check if user already paid for this resume
    const existingDownload = await db.resumeDownload.findFirst({
      where: {
        resumeId,
        userId: session.user.id,
        status: 'completed',
      },
    });

    if (existingDownload) {
      // User already paid, allow free re-download
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        downloadUrl: `/api/resume/generate-pdf?resumeId=${resumeId}`,
      });
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initiate payment
    const paymentResult = await PaymentService.initiatePayment({
      provider: 'FLUTTERWAVE', // Default to Flutterwave, can be made configurable
      method: 'CARD',
      amount: amount || 2.0,
      currency,
      customerEmail: user.email || '',
      customerName: user.name || 'User',
      description: 'Resume PDF Download',
      callbackUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/resume/payment-callback`,
      metadata: {
        userId: user.id,
        resumeId,
        type: 'resume_download',
      },
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment initiation failed' },
        { status: 500 }
      );
    }

    // Create pending download record
    await db.resumeDownload.create({
      data: {
        resumeId,
        userId: session.user.id,
        amount: amount || 2.0,
        transactionId: paymentResult.transactionId || null,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      transactionId: paymentResult.transactionId,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

