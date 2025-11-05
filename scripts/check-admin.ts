import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.log(`❌ User with email "${email}" not found in database.`);
      return;
    }

    console.log("\n📋 User Information:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`ID:        ${user.id}`);
    console.log(`Name:      ${user.name ?? "N/A"}`);
    console.log(`Email:     ${user.email}`);
    console.log(`Role:      ${user.role}`);
    console.log(`Created:   ${user.createdAt.toLocaleString()}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (user.role === "ADMIN") {
      console.log("\n✅ YES - This user IS an ADMIN.");
    } else {
      console.log(`\n❌ NO - This user is NOT an admin. Current role: ${user.role}`);
      console.log("\nTo make this user an admin, run:");
      console.log(`  npx tsx scripts/set-admin.ts ${email}`);
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2] || "kazibweusama@gmail.com";
checkAdmin(email);

