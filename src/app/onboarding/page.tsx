"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { JobSeekerProfileForm } from "~/components/JobSeekerProfileForm";
import { ProfileSteps } from "~/components/ProfileSteps";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<"form" | "progress">("form");

  const jobSeekerData = api.users.getProfile.useQuery(undefined, {
    enabled: !!sessionData?.user,
    retry: false,
    onError: (error) => {
      console.error("Error fetching job seeker profile data:", error);
    }
  });

  const companiesQuery = api.companies.getVerifiedCompanies.useQuery(undefined, {
    enabled: !!sessionData?.user,
    retry: false,
    onError: (error) => {
      console.error("Error fetching companies:", error);
    }
  });

  useEffect(() => {
    if (jobSeekerData.data?.jobSeekerProfile) {
      setActiveTab("progress");
    }
  }, [jobSeekerData.data]);

  if (!sessionData?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sign in required</h1>
          <p className="text-gray-600">Please sign in to access the onboarding process.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Job Seeker Profile Setup
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Complete your profile to make your future job applications faster and improve your chances of getting hired!
            </p>
          </div>
          
          {/* Loading state */}
          {(jobSeekerData.isLoading || companiesQuery.isLoading) && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="mt-4 text-gray-600">Loading profile data...</p>
            </div>
          )}
          
          {/* Error state */}
          {(jobSeekerData.isError || companiesQuery.isError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto text-center">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error loading data</h3>
              <p className="text-red-600 mb-4">
                There was an issue retrieving your profile information. Please try again later.
              </p>
              <p className="text-sm text-gray-500">
                Error details: {jobSeekerData.isError ? jobSeekerData.error.message : ''} 
                {companiesQuery.isError ? companiesQuery.error.message : ''}
              </p>
            </div>
          )}

        {jobSeekerData.data?.jobSeekerProfile ? (
          <div className="mb-8">
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("form")}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === "form"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("progress")}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === "progress"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  Profile Completion
                </button>
              </nav>
            </div>

            {activeTab === "form" ? (
              <JobSeekerProfileForm
                companies={companiesQuery.data?.companies || []}
                user={sessionData.user}
              />
            ) : (
              <ProfileSteps profileData={jobSeekerData.data?.jobSeekerProfile || jobSeekerData.data} />
            )}
          </div>
        ) : (
          <JobSeekerProfileForm
            companies={companiesQuery.data?.companies || []}
            user={sessionData.user}
          />
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}
