import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProfileCompletionBannerProps {
  completionPercentage?: number;
}

export function ProfileCompletionBanner({ completionPercentage = 0 }: ProfileCompletionBannerProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 relative">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-blue-800">Complete your profile</h3>
              <div className="mt-1">
                <p className="text-sm text-blue-700">
                  Your profile is {completionPercentage}% complete. Adding more details increases your chances of finding the perfect job match.
                </p>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Complete Profile Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}