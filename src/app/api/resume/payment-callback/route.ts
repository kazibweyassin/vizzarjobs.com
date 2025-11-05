import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { PaymentService } from '~/lib/payments';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get('transaction_id');
    const status = searchParams.get('status');

    if (!transactionId) {
      return NextResponse.redirect(new URL('/tools/resume-builder?error=missing_transaction', request.url));
    }

    // Find the download record
    const download = await db.resumeDownload.findFirst({
      where: {
        transactionId,
      },
      include: {
        resume: true,
      },
    });

    if (!download) {
      return NextResponse.redirect(new URL('/tools/resume-builder?error=download_not_found', request.url));
    }

    // Verify payment
    const verification = await PaymentService.verifyPayment('FLUTTERWAVE', transactionId);

    if (verification.success && verification.paid) {
      // Update download status
      await db.resumeDownload.update({
        where: { id: download.id },
        data: {
          status: 'completed',
          paymentProvider: 'FLUTTERWAVE',
          paymentMethod: 'CARD',
        },
      });

      // Redirect to download page
      return NextResponse.redirect(
        new URL(`/tools/resume-builder?download=${download.resumeId}&paid=true`, request.url)
      );
    } else {
      // Payment failed
      await db.resumeDownload.update({
        where: { id: download.id },
        data: {
          status: 'failed',
        },
      });

      return NextResponse.redirect(new URL('/tools/resume-builder?error=payment_failed', request.url));
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(new URL('/tools/resume-builder?error=callback_error', request.url));
  }
}

