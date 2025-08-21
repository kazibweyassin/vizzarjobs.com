import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { PrismaClient } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Check if the user is authenticated and has admin access
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Use direct SQL query since we're having issues with the Prisma client model
    const prisma = new PrismaClient();
    const leads = await prisma.$queryRaw`SELECT * FROM "Lead" ORDER BY "createdAt" DESC`;
    
    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
