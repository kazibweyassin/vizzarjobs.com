import { NextRequest, NextResponse } from 'next/server';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { calculateATSScore } from '~/lib/ats-scoring';
import type { ResumeData } from '~/types/resume';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, data, template } = body as { id?: string; data: ResumeData; template?: string };

    if (!data) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    // Calculate ATS score
    const atsScore = calculateATSScore(data);

    if (id) {
      // Update existing resume
      const resume = await db.resume.update({
        where: { id },
        data: {
          data: data as any,
          template: template || 'modern',
          atsScore,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ id: resume.id, success: true });
    } else {
      // Create new resume
      const resume = await db.resume.create({
        data: {
          userId: session.user.id,
          title: `${data.personalInfo.firstName} ${data.personalInfo.lastName}'s Resume` || 'My Resume',
          data: data as any,
          template: template || 'modern',
          atsScore,
        },
      });

      return NextResponse.json({ id: resume.id, success: true });
    }
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json(
      { error: 'Failed to save resume' },
      { status: 500 }
    );
  }
}

