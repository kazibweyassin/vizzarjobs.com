import { NextRequest, NextResponse } from 'next/server';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { generateResumePDF } from '~/lib/pdf-generator';
import type { ResumeData } from '~/types/resume';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const resumeId = searchParams.get('resumeId');

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 });
    }

    // Fetch resume from database
    const resume = await db.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Check if user has paid for this resume
    const download = await db.resumeDownload.findFirst({
      where: {
        resumeId,
        userId: session.user.id,
        status: 'completed',
      },
    });

    if (!download) {
      return NextResponse.json(
        { error: 'Payment required. Please pay $2 to download PDF.' },
        { status: 402 } // Payment Required
      );
    }

    // Generate PDF
    const pdfBuffer = await generateResumePDF(
      resume.data as ResumeData,
      (resume.template as any) || 'modern'
    );

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${resume.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, resumeData, template } = body;

    let resume: { id: string; data: any; template: string; userId: string } | null = null;

    if (resumeId) {
      // Fetch resume from database
      resume = await db.resume.findFirst({
        where: {
          id: resumeId,
          userId: session.user.id,
        },
      });

      if (!resume) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      // Check if user has paid for this resume
      const download = await db.resumeDownload.findFirst({
        where: {
          resumeId,
          userId: session.user.id,
          status: 'completed',
        },
      });

      if (!download) {
        return NextResponse.json(
          { error: 'Payment required. Please pay $2 to download PDF.' },
          { status: 402 } // Payment Required
        );
      }
    } else if (resumeData) {
      // Direct resume data provided (for testing/preview)
      resume = {
        id: 'temp',
        data: resumeData,
        template: template || 'modern',
        userId: session.user.id,
      };
    } else {
      return NextResponse.json({ error: 'Resume ID or data is required' }, { status: 400 });
    }

    // Generate PDF
    const pdfBuffer = await generateResumePDF(
      resume.data as ResumeData,
      (resume.template as any) || 'modern'
    );

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${resume.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

