import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkVizaid() {
  const company = await prisma.company.findUnique({
    where: { id: 'cmguxlo4y0003ipccvozs96tg' },
    include: {
      jobs: true,
      employees: true
    }
  });

  if (!company) {
    console.log('✅ VIZAID company NOT FOUND - successfully deleted!');
  } else {
    console.log('⚠️  VIZAID still exists:');
    console.log(`   Name: ${company.name}`);
    console.log(`   Jobs: ${company.jobs.length}`);
    console.log(`   Employees: ${company.employees.length}`);
  }

  await prisma.$disconnect();
}

checkVizaid();
