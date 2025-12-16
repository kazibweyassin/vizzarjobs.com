// Delete fake VIZAID company
import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function deleteFakeCompany() {
  try {
    const companyId = 'cmguxlo4y0003ipccvozs96tg'; // VIZAID TRAVEL CONSULT
    
    console.log('\n⚠️  VIZAID TRAVEL CONSULT - FAKE COMPANY DETECTED\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('This company has 377 jobs that need to be handled.');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('⚠️  RECOMMENDED: Delete company AND all 377 jobs');
    console.log('These jobs are incorrectly attributed to a travel agency.\n');
    
    const choice = await askQuestion('Delete VIZAID and all 377 jobs? (yes/no): ');
    
    if (choice.toLowerCase() === 'yes' || choice.toLowerCase() === 'y') {
      console.log('\n🗑️  Deleting company and all associated data...\n');
      
      // Delete all jobs first
      const deleteJobs = await prisma.job.deleteMany({
        where: { companyId }
      });
      
      console.log(`✅ Deleted ${deleteJobs.count} jobs`);
      
      // Delete all employees
      const deleteEmployees = await prisma.employee.deleteMany({
        where: { companyId }
      });
      
      console.log(`✅ Deleted ${deleteEmployees.count} employees`);
      
      // Delete the company
      await prisma.company.delete({
        where: { id: companyId }
      });
      
      console.log('✅ Deleted fake company\n');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('✅ Cleanup complete!');
      console.log(`📊 Removed:`);
      console.log(`   - 1 fake company`);
      console.log(`   - ${deleteJobs.count} jobs`);
      console.log(`   - ${deleteEmployees.count} employees`);
      console.log('═══════════════════════════════════════════════════════════\n');
      
      // Show remaining stats
      const remainingJobs = await prisma.job.count();
      const remainingCompanies = await prisma.company.count();
      
      console.log('📊 Database after cleanup:');
      console.log(`   Jobs: ${remainingJobs}`);
      console.log(`   Companies: ${remainingCompanies}\n`);
      
    } else {
      console.log('\n❌ Cancelled. No changes made.\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

deleteFakeCompany();
