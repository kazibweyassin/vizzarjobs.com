# How to Add Jobs to VizzarJobs Platform

## Overview
There are **3 ways** to add jobs to the VizzarJobs platform:

1. **Employer Self-Service** - Through the website UI (for verified employers)
2. **Admin Job Creation** - Through admin panel (for administrators)
3. **Automated Import** - From external job boards (RemoteOK, RapidAPI)

---

## 1. Employer Self-Service (Recommended for Real Users)

### Prerequisites
- User must be **logged in**
- User must have **EMPLOYER role**
- User must be associated with a **verified company**
- Company must have `verified: true` status in database

### How It Works

#### Step 1: Access the Post Job Page
- Navigate to: **https://vizzarjobs.com/post-job**
- Or click "Post a Job" button in navigation

#### Step 2: Authentication Check
- System automatically redirects to `/auth/signin` if not logged in
- After login, redirects back to `/post-job` page

#### Step 3: Company Verification
The system checks:
```typescript
// User must have employee record linked to a company
userData?.employee?.company?.id  // Must exist
userData?.employee?.company?.verified  // Must be true
```

#### Step 4: Fill Out Job Form

**Basic Information:**
- ✅ Job Title* (e.g., "Senior Software Engineer")
- ✅ Company Name* (auto-filled from your company profile)
- ✅ Location* (e.g., "Kampala, Uganda")
- ✅ Country* (e.g., "Uganda")

**Job Details:**
- ✅ Job Type* (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
- ✅ Experience Level* (ENTRY, MID, SENIOR, LEAD)
- ✅ Application URL* (where candidates apply)
- ☑️ Visa Sponsorship Available (checkbox)

**Compensation:**
- ☑️ Minimum Salary (optional, in USD)
- ☑️ Maximum Salary (optional, in USD)

**Description & Requirements:**
- ✅ Job Description* (rich text editor, supports formatting)
- ☑️ Requirements (add multiple items, e.g., "5+ years React experience")
- ☑️ Tech Stack (e.g., "React", "Node.js", "PostgreSQL")

#### Step 5: Submit
- Click "Post Job" button
- System validates all required fields
- Creates job in database with `companyId` from your company
- Redirects to job detail page: `/jobs/{jobId}`

### Error Handling

**Company Not Found:**
```
"You need to be associated with a company to post jobs. 
Please contact support."
```

**Company Not Verified:**
```
"Your company needs to be verified by an admin before posting jobs"
```

**Missing Required Fields:**
- Red error messages appear below each invalid field
- Form submission blocked until all fixed

### Code Location
- **UI Component**: `src/components/PostJobForm.tsx`
- **Page**: `src/app/post-job/page.tsx`
- **API**: `src/server/api/routers/jobs.ts` → `create` mutation

---

## 2. Admin Job Creation (For Administrators)

### Prerequisites
- User must have **ADMIN role**
- Can post jobs for **any verified company**

### How It Works

#### Access Admin Panel
Navigate to: **https://vizzarjobs.com/admin/create-job**

#### Additional Features vs Employer Form
- ✅ Select any company from dropdown (not just your own)
- ✅ Mark as **Featured** (appears in featured section)
- ✅ Mark as **Premium** (highlighted with premium badge)

#### Form Fields (Same as Employer + Admin Features)
- Company Selection Dropdown (all verified companies)
- Featured Toggle (boolean)
- Premium Toggle (boolean)
- All standard job fields

### Code Location
- **UI Component**: `src/components/AdminJobForm.tsx`
- **Page**: `src/app/admin/create-job/page.tsx`
- **API**: Same `jobs.create` mutation

---

## 3. Automated Job Import (For Bulk Job Seeding)

### Option A: RemoteOK Import

#### Access
Navigate to: **https://vizzarjobs.com/admin/import-jobs** (Admin only)

#### Features
- Imports jobs from RemoteOK API (free, no API key needed)
- Filters: location, remote, job type, visa sponsorship
- Batch processing: up to 10 pages per import
- Automatic company creation (if not exists)
- Duplicate detection (skips existing jobs)

#### Configuration
```typescript
{
  query: 'software engineer developer',
  location: 'United States', 
  numPages: 3,
  remote: true,
  visaSponsorship: true
}
```

#### How It Works
1. Fetches jobs from RemoteOK API
2. For each job:
   - Check if job already exists (by title + company + URL)
   - Find or create company
   - Create job with company association
3. Returns summary: `{ imported: 10, skipped: 5, errors: [] }`

### Option B: RapidAPI Import

#### Access
Same page: **https://vizzarjobs.com/admin/import-jobs**

#### Features
- Imports from multiple job boards via RapidAPI
- Requires API key: `e6aecaead8mshf8994f3857bb7b6p129f34jsnb806f67eea00`
- More job sources than RemoteOK
- Same filtering and duplicate detection

#### Configuration
```typescript
{
  apiKey: 'YOUR_RAPIDAPI_KEY',
  query: 'software engineer',
  location: 'United States',
  numPages: 3
}
```

### Option C: Manual Seed Script

#### For Development/Testing Only

Run the seed script:
```powershell
npx tsx test-job-creation.js
```

This creates:
- 1 test company (if none exist)
- 1 test job with sample data

### Code Location
- **Import UI**: `src/app/admin/import-jobs/page.tsx`
- **RemoteOK API**: `src/lib/job-import/remoteok.ts`
- **RapidAPI**: `src/lib/job-import/rapidapi.ts`
- **API Router**: `src/server/api/routers/jobs.ts` → `importFromRemoteOK`, `importFromRapidAPI`

---

## API Reference

### Job Creation Endpoint

**Endpoint**: `api.jobs.create`  
**Type**: tRPC Protected Procedure  
**Authentication**: Required (logged in user)

#### Input Schema
```typescript
{
  title: string;              // Required
  company: string;            // Required
  description: string;        // Required
  requirements: string[];     // Array of requirements
  location: string;           // Required (e.g., "Kampala")
  country: string;            // Required (e.g., "Uganda")
  visaSponsorship: boolean;   // Default: false
  salaryMin?: number;         // Optional (in USD)
  salaryMax?: number;         // Optional (in USD)
  jobType: JobType;           // Required enum
  experienceLevel: ExperienceLevel; // Required enum
  techStack: string[];        // Array of technologies
  applicationUrl: string;     // Required valid URL
  companyId: string;          // Required company UUID
  featured?: boolean;         // Admin only
  premium?: boolean;          // Admin only
}
```

#### Job Types (Enum)
```typescript
enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP"
}
```

#### Experience Levels (Enum)
```typescript
enum ExperienceLevel {
  ENTRY = "ENTRY",     // 0-2 years
  MID = "MID",         // 2-5 years
  SENIOR = "SENIOR",   // 5-10 years
  LEAD = "LEAD"        // 10+ years
}
```

#### Response
```typescript
{
  id: string;
  title: string;
  description: string;
  company: {
    id: string;
    name: string;
    logo: string | null;
    verified: boolean;
  };
  location: string;
  // ... all other job fields
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Database Schema

### Job Table
```prisma
model Job {
  id                String          @id @default(cuid())
  title             String
  description       String
  companyId         String
  company           Company         @relation(fields: [companyId], references: [id])
  location          String
  country           String?
  jobType           JobType
  experienceLevel   ExperienceLevel
  salaryMin         Int?
  salaryMax         Int?
  applicationUrl    String
  requirements      String[]
  skills            String[]
  techStack         String[]
  remote            Boolean         @default(false)
  visaSponsorship   Boolean         @default(false)
  featured          Boolean         @default(false)
  premium           Boolean         @default(false)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  applications      Application[]
}
```

### Company Requirements
```prisma
model Company {
  id                  String    @id @default(cuid())
  name                String    @unique
  verified            Boolean   @default(false)
  verificationStatus  VerificationStatus @default(PENDING)
  jobs                Job[]
  employees           Employee[]
}
```

---

## Common Issues & Solutions

### Issue 1: "You need to be associated with a company"
**Cause**: User doesn't have employee record linked to company  
**Solution**: Admin must create employee relationship:
```sql
INSERT INTO Employee (userId, companyId) 
VALUES ('user-id', 'company-id');
```

### Issue 2: "Company needs to be verified"
**Cause**: Company `verified` field is false  
**Solution**: Admin must verify company:
```sql
UPDATE Company 
SET verified = true, verificationStatus = 'APPROVED' 
WHERE id = 'company-id';
```

### Issue 3: "Job not appearing on site"
**Checks**:
1. Job created successfully (check database)
2. Company is verified
3. Job hasn't been deleted
4. No filters hiding the job

### Issue 4: Import fails with "duplicate job"
**Expected behavior**: System skips jobs that already exist (by title + company + URL)  
**Solution**: Change job title or URL to create variation

---

## Testing Job Creation

### Test Checklist

**As Employer:**
1. ✅ Login as user with EMPLOYER role
2. ✅ Navigate to /post-job
3. ✅ Fill required fields
4. ✅ Submit form
5. ✅ Verify redirect to /jobs/{id}
6. ✅ Check job appears in /jobs list

**As Admin:**
1. ✅ Login as user with ADMIN role
2. ✅ Navigate to /admin/create-job
3. ✅ Select company from dropdown
4. ✅ Toggle featured/premium if needed
5. ✅ Submit form
6. ✅ Verify job created

**Import Test:**
1. ✅ Login as admin
2. ✅ Navigate to /admin/import-jobs
3. ✅ Configure RemoteOK settings
4. ✅ Click "Import Jobs"
5. ✅ Check import summary
6. ✅ Verify jobs in database

---

## Quick Start Guide

### For Employers
```
1. Sign up at https://vizzarjobs.com/auth/signup
2. Wait for admin to verify your company
3. Go to https://vizzarjobs.com/post-job
4. Fill out the form
5. Click "Post Job"
```

### For Admins (Bulk Import)
```
1. Login as admin
2. Go to https://vizzarjobs.com/admin/import-jobs
3. Select "RemoteOK" or "RapidAPI"
4. Configure filters:
   - Query: "software engineer"
   - Location: "United States"
   - Pages: 3
5. Click "Import Jobs"
6. Wait for completion
```

### For Developers (Direct Database)
```typescript
import { db } from "~/server/db";

const job = await db.job.create({
  data: {
    title: "Software Engineer",
    description: "Build amazing products",
    location: "Kampala, Uganda",
    country: "Uganda",
    jobType: "FULL_TIME",
    experienceLevel: "MID",
    applicationUrl: "https://example.com/apply",
    companyId: "existing-company-id",
    requirements: ["React", "Node.js"],
    techStack: ["TypeScript", "PostgreSQL"],
    visaSponsorship: false,
  }
});
```

---

## Current Job Statistics

Based on your database:
- **Total Jobs**: 77 real jobs
- **Companies**: 67 verified companies
- **Fake Jobs Removed**: 377 (VIZAID jobs deleted)

All jobs are now **real opportunities** from verified sources! 🎉
