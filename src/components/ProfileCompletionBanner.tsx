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
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 relative">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-amber-900">Complete your profile</h3>
          <p className="text-sm text-amber-700 mt-0.5">
            Your profile is {completionPercentage}% complete. Adding more details increases your chances of finding the perfect job match.
          </p>
          <div className="mt-2.5 w-full bg-amber-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-[#0F2C4C] hover:bg-[#0F2C4C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F2C4C]/30 transition-all"
            >
              Complete Profile Now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}