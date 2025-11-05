import { NextRequest, NextResponse } from 'next/server';
import { auth } from '~/server/auth';
import { db } from '~/server/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Check if user has paid for this resume
    const download = await db.resumeDownload.findFirst({
      where: {
        resumeId: id,
        userId: session.user.id,
        status: 'completed',
      },
    });

    return NextResponse.json({
      paid: !!download,
      downloadId: download?.id,
    });
  } catch (error) {
    console.error('Error checking payment:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

