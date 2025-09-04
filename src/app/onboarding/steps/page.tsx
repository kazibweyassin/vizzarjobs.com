"use client";

import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { OnboardingSteps } from "~/components/OnboardingSteps";
import { Loader2 } from "lucide-react";

export default function OnboardingStepsPage() {
  const { data: sessionData } = useSession();

  const employeeData = api.users.getEmployeeData.useQuery(undefined, {
    enabled: !!sessionData?.user,
  });

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
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Complete Your Onboarding
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
            Follow the steps below to complete your employee onboarding process.
          </p>
        </div>

        {employeeData.isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : (
          <OnboardingSteps employeeData={employeeData.data} />
        )}
      </div>
    </div>
  );
}
