"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ProfileCompletionBanner } from "./ProfileCompletionBanner";
import { useProfileCompletion } from "./ProfileCompletionProvider";

// Pages where we don't want to show the banner
const EXCLUDED_PATHS = [
  "/onboarding", 
  "/auth/signin", 
  "/auth/signup", 
  "/auth/error",
  "/profile/edit"
];

export function ProfileCompletionReminder() {
  const { data: session, status } = useSession();
  const { completionPercentage, isProfileComplete, isLoading } = useProfileCompletion();
  const pathname = usePathname();
  
  // Don't show on excluded paths or when loading
  if (
    isLoading || 
    status !== "authenticated" || 
    isProfileComplete || 
    EXCLUDED_PATHS.some(path => pathname?.startsWith(path))
  ) {
    return null;
  }
  
  return (
    <div className="sticky top-0 z-50">
      <ProfileCompletionBanner completionPercentage={completionPercentage} />
    </div>
  );
}