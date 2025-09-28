"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";
import { EmployerProfileForm } from "~/components/EmployerProfileForm";
import { ErrorBoundary } from "react-error-boundary";
import { ProfileSteps } from "~/components/ProfileSteps";

export default function EmployerOnboardingPage() {
  const { data: sessionData } = useSession();
  const [activeTab, setActiveTab] = useState<"form" | "progress">("form");

  // Fetch employer/company data
  const employerData = api.users.getProfile.useQuery(undefined, {
    enabled: !!sessionData?.user,
    retry: false,
    onError: (error) => {
      console.error("Error fetching employer data:", error);
    }
  });

  useEffect(() => {
    if (employerData.data?.employee?.company) {
      setActiveTab("progress");
    }
  }, [employerData.data]);

  if (!sessionData?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading user session...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={<div className="text-red-500 p-4">Something went wrong loading the employer onboarding page.</div>}
    >
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Employer Registration
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Create your company profile to start posting jobs and connecting with top talent.
            </p>
          </div>
          
          {/* Loading state */}
          {employerData.isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="mt-4 text-gray-600">Loading profile data...</p>
            </div>
          )}
          
          {/* Error state */}
          {employerData.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto text-center">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error loading data</h3>
              <p className="text-red-600 mb-4">
                There was an issue retrieving your profile information. Please try again later.
              </p>
              <p className="text-sm text-gray-500">
                Error details: {employerData.error.message}
              </p>
            </div>
          )}
          
          {/* Display content when loaded */}
          {!employerData.isLoading && !employerData.isError && (
            <>
              {employerData.data?.company ? (
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
                        Company Information
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
                        Verification Status
                      </button>
                    </nav>
                  </div>

                  {activeTab === "form" ? (
                    <EmployerProfileForm user={sessionData.user} />
                  ) : (
                    <ProfileSteps profileData={{
                      ...employerData.data.company,
                      steps: [
                        {
                          id: "company-info",
                          title: "Company Information",
                          description: "Basic company details",
                          completed: true,
                          completedAt: new Date()
                        },
                        {
                          id: "verification",
                          title: "Company Verification",
                          description: "Verification of company details",
                          completed: employerData.data.company.verified,
                          completedAt: employerData.data.company.verificationDate || null
                        },
                        {
                          id: "post-job",
                          title: "Post Your First Job",
                          description: "Create your first job posting",
                          completed: false,
                          completedAt: null
                        }
                      ]
                    }} />
                  )}
                </div>
              ) : (
                <EmployerProfileForm user={sessionData.user} />
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}