"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Upload,
  X,
  AlertCircle,
  Briefcase,
  User,
  Globe,
  Award
} from "lucide-react";

interface ProfileStep {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: Date | null;
}

interface ProfileStepsProps {
  profileData: any;
}

export function ProfileSteps({ profileData }: ProfileStepsProps) {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  // Default steps for job seeker profile completion
  const defaultSteps = [
    {
      id: "personal-info",
      title: "Complete Personal Information",
      description: "Fill in your basic personal details",
      completed: !!profileData?.fullName && !!profileData?.title,
      completedAt: profileData?.updatedAt || null,
    },
    {
      id: "skills",
      title: "Add Skills and Experience",
      description: "List your professional skills and work experience",
      completed: !!profileData?.skillsAndExperience,
      completedAt: profileData?.updatedAt || null,
    },
    {
      id: "preferences",
      title: "Set Job Preferences",
      description: "Specify your desired salary, location and job types",
      completed: !!profileData?.preferredJobTypes?.length || !!profileData?.desiredSalary,
      completedAt: profileData?.updatedAt || null,
    },
    {
      id: "links",
      title: "Add Professional Links",
      description: "Add links to your LinkedIn, portfolio or personal website",
      completed: !!profileData?.linkedInProfile || !!profileData?.portfolioUrl,
      completedAt: profileData?.updatedAt || null,
    },
    {
      id: "resume",
      title: "Upload Resume",
      description: "Upload your latest resume/CV",
      completed: !!profileData?.resumeUrl,
      completedAt: profileData?.updatedAt || null,
    }
  ];

  // Use provided steps or default ones
  const steps = profileData?.steps || defaultSteps;

  // Calculate completion percentage
  const completedSteps = steps.filter((step: ProfileStep) => step.completed).length;
  const completionPercentage = Math.round((completedSteps / steps.length) * 100);

  const handleStepClick = (stepId: string) => {
    setActiveStep(activeStep === stepId ? null : stepId);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl">Profile Completion</span>
          <Badge variant={completionPercentage === 100 ? "secondary" : "default"} className="text-sm font-medium px-3 py-1">
            {completionPercentage}% Complete
          </Badge>
        </CardTitle>
        <CardDescription>
          Complete these steps to maximize your job search potential
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          <div className="divide-y divide-gray-200">
            {steps.map((step: ProfileStep) => (
              <div key={step.id} className="py-4">
                <button
                  className="w-full flex items-start justify-between text-left"
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{step.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </p>
                      {step.completed && step.completedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Completed on {new Date(step.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {activeStep === step.id && (
                  <div className="mt-4 ml-8 pl-3 border-l-2 border-gray-200">
                    <div className="prose prose-sm max-w-none">
                      {!step.completed ? (
                        <div className="text-sm text-gray-700">
                          <p className="mb-2">
                            {step.id === "personal-info" && (
                              "Add your full name, professional title and current location to help employers find you."
                            )}
                            {step.id === "skills" && (
                              "List your skills, technologies you're familiar with, and summarize your work experience."
                            )}
                            {step.id === "preferences" && (
                              "Set your job type preferences, desired salary range, and whether you need visa sponsorship or are willing to relocate."
                            )}
                            {step.id === "links" && (
                              "Connect your LinkedIn profile and portfolio/personal website to give employers a complete picture of your experience."
                            )}
                            {step.id === "resume" && (
                              "Upload your resume/CV to make applying for jobs faster and increase your visibility to employers."
                            )}
                          </p>
                          <a 
                            href="#" 
                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              // Handle navigation to appropriate section
                            }}
                          >
                            Complete this step <span className="ml-1">→</span>
                          </a>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700">
                          <p className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-sm text-gray-500">
            <Award className="h-4 w-4 mr-1 text-blue-500" />
            {completionPercentage === 100 ? (
              <span>Your profile is complete! You're ready to apply for jobs.</span>
            ) : (
              <span>Complete your profile to increase your chances of being hired.</span>
            )}
          </div>
          <Badge variant={completionPercentage === 100 ? "secondary" : "default"} className="text-xs font-medium">
            {completionPercentage}%
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}
