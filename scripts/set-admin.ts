// scripts/set-admin.ts
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function setUserAsAdmin(email: string) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      return;
    }

    // Update the user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' as UserRole },
    });

    console.log(`User ${updatedUser.name} (${updatedUser.email}) has been set as ADMIN`);
  } catch (error) {
    console.error('Error setting user as admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check if email is provided as argument
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Please provide an email address as an argument');
  console.error('Usage: npx tsx scripts/set-admin.ts your-email@example.com');
  process.exit(1);
}

setUserAsAdmin(userEmail).catch(console.error);
