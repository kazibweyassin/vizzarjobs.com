import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, interests } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Try using the db instance directly from the imported client
    const lead = await db.lead.create({
      data: {
        name,
        email,
        interests: interests || [],
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Error saving lead:", error);
    return NextResponse.json(
      { error: "Failed to save lead information" },
      { status: 500 }
    );
  }
}
