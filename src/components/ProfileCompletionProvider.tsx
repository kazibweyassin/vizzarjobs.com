"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { calculateProfileCompletion } from "~/lib/profileUtils";

interface ProfileCompletionContextType {
  completionPercentage: number;
  isProfileComplete: boolean;
  isLoading: boolean;
}

const ProfileCompletionContext = createContext<ProfileCompletionContextType>({
  completionPercentage: 0,
  isProfileComplete: false,
  isLoading: true,
});

export function useProfileCompletion() {
  return useContext(ProfileCompletionContext);
}

export function ProfileCompletionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user data with profile information
  const { data: userData, isLoading: isUserLoading } = api.users.getCurrentUser.useQuery(
    undefined,
    { enabled: status === "authenticated" && !!session?.user?.id }
  );
  
  useEffect(() => {
    if (!isUserLoading && userData) {
      const percentage = calculateProfileCompletion(userData);
      setCompletionPercentage(percentage);
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [userData, isUserLoading, status]);
  
  const value = {
    completionPercentage,
    isProfileComplete: completionPercentage === 100,
    isLoading,
  };
  
  return (
    <ProfileCompletionContext.Provider value={value}>
      {children}
    </ProfileCompletionContext.Provider>
  );
}