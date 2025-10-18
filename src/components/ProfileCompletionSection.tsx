"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileCompletion } from "./ProfileCompletionProvider";
import { CheckCircle, XCircle, ChevronRight, Briefcase, BookOpen, Code, FileText, User, MapPin } from "lucide-react";

export function ProfileCompletionSection() {
  const router = useRouter();
  const { completionPercentage, isProfileComplete } = useProfileCompletion();
  const [isOpen, setIsOpen] = useState(true);
  
  // Don't show if profile is complete
  if (isProfileComplete) return null;
  
  // Define the sections to complete
  const sections = [
    {
      name: "Personal Information",
      icon: User,
      status: completionPercentage >= 15,
      description: "Basic details about you"
    },
    {
      name: "Career Preferences",
      icon: MapPin,
      status: completionPercentage >= 30,
      description: "Job types, salary, location preferences"
    },
    {
      name: "Education",
      icon: BookOpen,
      status: completionPercentage >= 45,
      description: "Your educational background"
    },
    {
      name: "Work Experience",
      icon: Briefcase,
      status: completionPercentage >= 60,
      description: "Your work history"
    },
    {
      name: "Skills",
      icon: Code,
      status: completionPercentage >= 75,
      description: "Technical & professional skills"
    },
    {
      name: "Projects & Portfolio",
      icon: FileText,
      status: completionPercentage >= 90,
      description: "Showcase your work"
    }
  ];

  if (!isOpen) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Complete Your Profile</h3>
          <button 
            onClick={() => setIsOpen(true)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Show Tasks
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Complete Your Profile</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Collapse</span>
          <XCircle className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Profile completion: {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-2 rounded-md ${
              section.status ? "bg-green-50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${section.status ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}>
                <section.icon className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${section.status ? "text-green-700" : "text-gray-700"}`}>
                  {section.name}
                </p>
                <p className="text-xs text-gray-500">{section.description}</p>
              </div>
            </div>
            <div className="flex items-center">
              {section.status ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <button
          onClick={() => router.push("/onboarding")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue Profile Setup
        </button>
      </div>
    </div>
  );
}