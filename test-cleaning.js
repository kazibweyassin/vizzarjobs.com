// Test the cleaning function with the problematic job description
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample problematic description
const sampleDescription = `Job Description
At Connectly we are building the future of conversational commerce in Latin America with the focus on Whatsapp. Instead of shoppers installing yet another app, we are offering a 360 engagement platform for retailers inside of an app that everyone already have on their phone - Whatsapp. 

We are a VC-backed Series B startup with a world-class team hailing from Meta, Google, Uber, and other top Silicon Valley companies. We operate as a hybrid company, with offices in BogotÃ¡ and San Francisco, and a remote-first culture everywhere else

r />>>Job summaryl>>i>>Weâre looking for an exceptional >Senior Backend Engineer with strong >Go (Golang) expertise and experience designing >large-scale distributed systems.i>>Youâll work across backend and frontend domains, collaborating ly with product, sales, and AI platform teams to design, prototype, and launch powerful conversational experiences for some of Latin Americaâs largest retailers. This is a role for an independent problem solver who enjoys both deep technical challenges and high-impact product thinking

r />>>Responsibilities include: l>>i>>Design, build, and maintain distributed backend systems using Go, AWS, Kafka, Postgres, and DynamoDB.i>>Collaborate cross-functionally with product managers, designers, and enterprise partners to define user journeys, performance goals, and success metrics.i>>Own critical parts of Connectlyâs platform infrastructure â from messaging orchestration to data pipelines and API integrations.i>>Collaborate ly with product, AI, and frontend teams to deliver scalable, customer-facing features.i>>Ensure reliability, observability, and operational excellence across all services.i>>Establish, track, and iterate on performance metrics, leveraging data to optimize outcomes and drive measurable business results.i>>Work asynchronously with global teams, maintaining strong communication and documentation.i>>Plan and manage your workstream, making thoughtful tradeoffs between deadlines, quality, and innovation.i>>Mentor teammates, contribute to code reviews, and uphold engineering best practices in a fast-moving, distributed environment

r />>>What will make you excel at this job:l>>i>>Exceptional communication skills with both technical and non-technical stakeholders.i>>Deep attention to detail paired with strong system-level thinking; you can zoom out to strategy and dive deep into code.i>>A bias for action and results, with comfort navigating ambiguity and evolving product needs.i>>Genuine curiosity and a drive to stay ahead of the rapidly changing AI landscape.i>>Balance of product sense and technical rigor; you care as much about user experience as you do about system performance.i>>Experience with cloud infrastructure (AWS) and event-driven architectures.i>>Solid understanding of system design, concurrency, and data consistency.i>>Pragmatic approach to engineering; you balance simplicity, reliability, and speed

r />>>Requirementsl>>i>>BS or MS in Computer Science or related technical field.i>>5+ years of experience in hands-on software engineering roles.i>>Proven track record building and scaling enterprise systems using >Go, AWS, Kafka, Postgres, and/or DynamoDB.i>>Experience with Python is a plus.i>>Experience with frontend engineering (React, TypeScript, etc.) is a plus.i>>Prior experience developing or deploying WhatsApp conversational applications is a strong plus.i>>Experience working in fast-paced, customer-centric environments, ideally in a startup or high-growth tech company.i>>Based in >Europe; remote-first with occasional team offsites

r />>>Benefitsl>>i>>Work alongside an exceptional, mission-driven team in a culture that values curiosity, impact, and continuous learning.i>>Competitive compensation with equity participation.i>>Unlimited time off and flexible working hours.i>>Flexible working hours and remote-first culture across the EU

style="font-size:> 11pt">We are a strong believer in passion, curiosity and willingness to learn on the job. If you are in doubt, we encourage you to apply! 

style="font-size:> 11pt">Connectly is an equal opportunity employer. Weâre committed to building a diverse, inclusive, and supportive workplace that is distributed around the world.r />>r />>`;

// Cleaning functions
function fixMalformedSeparators(text) {
  let fixed = text;
  
  fixed = fixed
    .replace(/r\s*\/>>+/gi, '')
    .replace(/l>>+/gi, '')
    .replace(/i>>+/gi, '')
    .replace(/>>+/g, '')
    .replace(/r\s*\/>/gi, '')
    .replace(/style="[^"]*"/gi, '')
    .replace(/style='[^']*'/gi, '')
    .replace(/style=[^\s>]*/gi, '')
    .replace(/ly\s+with/gi, 'closely with')
    .replace(/([a-z])l>>/gi, '$1')
    .replace(/>>([a-z])/gi, '$1')
    .replace(/style="font-size:[^"]*"/gi, '')
    .replace(/font-size:\s*\d+pt/gi, '')
    .replace(/\br\s*\/>/gi, '<br>')
    .replace(/\br\s*>/gi, '<br>')
    .replace(/[>]{3,}/g, '')
    .replace(/[/]{3,}/g, '')
    .replace(/&[a-z]+;(?=[A-Z])/g, ' ');
  
  return fixed;
}

function fixEncodingIssues(text) {
  let fixed = text;
  
  fixed = fixed
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã /g, 'à')
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€˜/g, "'")
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
    .replace(/â€¦/g, '...')
    .replace(/â€¢/g, '•')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2013/g, '–')
    .replace(/\u2014/g, '—')
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u2022/g, '•');
  
  return fixed;
}

function cleanJobDescription(description) {
  if (!description) return '';
  
  let cleaned = description;
  
  console.log('\n===== ORIGINAL =====');
  console.log(cleaned.substring(0, 500));
  
  cleaned = fixMalformedSeparators(cleaned);
  console.log('\n===== AFTER SEPARATOR FIX =====');
  console.log(cleaned.substring(0, 500));
  
  cleaned = fixEncodingIssues(cleaned);
  console.log('\n===== AFTER ENCODING FIX =====');
  console.log(cleaned.substring(0, 500));
  
  // Remove spam text
  cleaned = cleaned.replace(/Please mention the word \*\*[^*]+\*\*.*?\(#[^)]+\)\./gi, '');
  cleaned = cleaned.replace(/This is a beta feature to avoid spam applicants\..*?human\./gi, '');
  
  return cleaned;
}

async function testCleaning() {
  console.log('🧪 Testing job description cleaning...\n');
  
  const cleaned = cleanJobDescription(sampleDescription);
  
  console.log('\n\n===== FINAL CLEANED =====');
  console.log(cleaned);
  
  console.log('\n\n✅ Cleaning test complete!');
  
  // Now check actual jobs in database
  console.log('\n\n📊 Checking jobs in database...\n');
  
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      description: true,
    },
    take: 3
  });
  
  console.log(`Found ${jobs.length} jobs in database`);
  
  if (jobs.length > 0) {
    console.log('\nFirst job description preview:');
    console.log('Title:', jobs[0].title);
    console.log('Description preview:', jobs[0].description?.substring(0, 300));
  }
  
  await prisma.$disconnect();
}

testCleaning().catch(console.error);
