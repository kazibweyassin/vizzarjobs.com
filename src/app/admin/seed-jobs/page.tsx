"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";
import { api } from "~/trpc/react";

const demoJobs = [
  {
    title: "Senior Frontend Developer",
    description: "We are looking for a senior frontend developer with experience in React and TypeScript.",
    companyId: "placeholder", // Will be replaced with actual company ID
    location: "New York, USA",
    visaSponsorship: true,
    salaryMin: 90000,
    salaryMax: 130000,
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    techStack: ["React", "TypeScript", "Next.js"]
  },
  {
    title: "Backend Engineer",
    description: "Experienced backend developer needed for our growing team.",
    companyId: "placeholder", // Will be replaced with actual company ID
    location: "Remote",
    visaSponsorship: true,
    salaryMin: 85000,
    salaryMax: 120000,
    jobType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    techStack: ["Node.js", "Express", "PostgreSQL"]
  },
  {
    title: "Full Stack Developer",
    description: "Join our team to work on exciting full stack projects.",
    companyId: "placeholder", // Will be replaced with actual company ID
    location: "London, UK",
    visaSponsorship: true,
    salaryMin: 70000,
    salaryMax: 95000,
    jobType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    title: "DevOps Engineer",
    description: "Help us build and maintain our cloud infrastructure.",
    companyId: "placeholder", // Will be replaced with actual company ID
    location: "Berlin, Germany",
    visaSponsorship: true,
    salaryMin: 80000,
    salaryMax: 110000,
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    techStack: ["AWS", "Kubernetes", "Terraform"]
  },
  {
    title: "UX/UI Designer",
    description: "Create beautiful and intuitive user interfaces for our products.",
    companyId: "placeholder", // Will be replaced with actual company ID
    location: "Paris, France",
    visaSponsorship: true,
    salaryMin: 65000,
    salaryMax: 90000,
    jobType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    techStack: ["Figma", "Adobe XD", "UI/UX"]
  },
  {
    title: "Data Scientist",
    description: "Work with large datasets to extract insights and build models.",
    companyId: "placeholder", // Will be replaced with actual company ID
    location: "Toronto, Canada",
    visaSponsorship: true,
    salaryMin: 95000,
    salaryMax: 140000,
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    techStack: ["Python", "TensorFlow", "SQL"]
  }
];

export default function SeedJobsPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // Get companies to associate with jobs
  const { data: companiesData } = api.companies.getVerifiedCompanies.useQuery();
  const companies = companiesData?.companies || [];
  
  // Mutation for creating a job
  const createJob = api.jobs.create.useMutation({
    onSuccess: () => {
      setMessage(prev => prev + "✅ ");
    },
    onError: (error) => {
      setError(`Error creating job: ${error.message}`);
      setIsSeeding(false);
    }
  });
  
  const handleSeed = async () => {
    if (companies.length === 0) {
      setError("No companies available. Please create at least one company first.");
      return;
    }
    
    setIsSeeding(true);
    setMessage("Seeding jobs: ");
    setError("");
    
    // Use the first company for all jobs if available
    const companyId = companies[0].id;
    
    // Create each demo job
    for (const job of demoJobs) {
      try {
        await createJob.mutateAsync({
          ...job,
          companyId
        });
      } catch (err) {
        console.error("Failed to create job:", err);
      }
    }
    
    setIsSeeding(false);
    setMessage(prev => prev + "\nFinished seeding jobs!");
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Seed Featured Jobs</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          This will create {demoJobs.length} demo jobs with visa sponsorship enabled 
          so they appear in the Featured Jobs section.
        </p>
        
        <p className="text-sm text-gray-500">
          Using company: {companies.length > 0 ? companies[0].name : "No companies available"}
        </p>
      </div>
      
      <Button 
        onClick={handleSeed}
        disabled={isSeeding || companies.length === 0}
        className="mb-4"
      >
        {isSeeding ? "Creating Jobs..." : "Create Demo Jobs"}
      </Button>
      
      {message && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <pre className="whitespace-pre-wrap">{message}</pre>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
