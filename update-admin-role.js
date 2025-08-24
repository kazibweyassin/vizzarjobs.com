// update-admin-role.js
// This script updates a user's role to ADMIN
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateUserToAdmin(email) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: 'ADMIN',
      },
    });
    
    console.log(`User ${updatedUser.name} (${updatedUser.email}) has been updated to ADMIN role.`);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Replace this with your email address
const adminEmail = 'kazibweusama@gmail.com';

updateUserToAdmin(adminEmail)
  .then(() => console.log('Update completed successfully.'))
  .catch(console.error);
