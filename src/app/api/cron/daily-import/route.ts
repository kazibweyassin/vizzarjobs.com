import { NextRequest, NextResponse } from 'next/server';
import { dailyJobImport, weeklyCleanup } from '~/lib/cron/daily-job-import';

export async function POST(request: NextRequest) {
  try {
    // Check for authorization header (optional security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('🚀 Cron job triggered: Daily job import');
    
    // Run daily import
    const importResult = await dailyJobImport();
    
    // Check if it's Sunday (weekly cleanup day)
    const today = new Date();
    const isSunday = today.getDay() === 0;
    
    let cleanupResult = null;
    if (isSunday) {
      console.log('📅 Sunday detected - running weekly cleanup');
      cleanupResult = await weeklyCleanup();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Daily import completed',
      import: importResult,
      cleanup: cleanupResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support GET for easy testing
export async function GET() {
  return NextResponse.json({
    message: 'Daily import cron endpoint',
    usage: 'POST to trigger daily import',
    timestamp: new Date().toISOString()
  });
}


