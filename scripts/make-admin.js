// Script to make a user an admin
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeUserAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: {
        email: email
      },
      data: {
        role: 'ADMIN'
      }
    });
    
    console.log(`Successfully updated user ${user.email} to ADMIN role`);
    console.log('User details:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments or use default
const email = process.argv[2] || 'kazibweusama@gmail.com';
makeUserAdmin(email);