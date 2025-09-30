"use client";

import { PremiumPaywall } from "./PremiumPaywall";

interface PremiumPaywallWrapperProps {
  jobTitle: string;
  companyName: string;
  isPremium: boolean;
  children: React.ReactNode;
}

export function PremiumPaywallWrapper({ 
  jobTitle, 
  companyName, 
  isPremium, 
  children 
}: PremiumPaywallWrapperProps) {
  if (!isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content for premium jobs */}
      <div className="filter blur-sm pointer-events-none">
        {children}
      </div>
      
      {/* Premium paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <PremiumPaywall 
          jobTitle={jobTitle} 
          companyName={companyName} 
        />
      </div>
    </div>
  );
}


