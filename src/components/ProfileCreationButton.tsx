"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { User, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function ProfileCreationButton() {
  const { data: session, status } = useSession();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Always show button for debugging
  const isDebugging = true;
  
  // Animation effect
  useEffect(() => {
    // Skip animation logic if we're debugging or session isn't loaded
    if (((!session?.user || session.user.profileComplete) && !isDebugging) || status === "loading") return;
    
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700); // Animation duration
    }, 5000); // Repeat every 5 seconds
    
    // Initial animation after 1 second
    const initialTimeout = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700);
    }, 1000);
    
    return () => {
      clearInterval(animationInterval);
      clearTimeout(initialTimeout);
    };
  }, [session, status]);
  
  // For debugging, always show the button
  if (isDebugging) {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }
  
  // Return null if not debugging and user doesn't need profile completion
  if (!isDebugging && (!session?.user || session.user.profileComplete)) {
    return null;
  }
  
  return (
    <Link href="/onboarding" className="profile-creation-button">
      <div 
        className={`
          inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold shadow-lg 
          bg-gradient-to-r from-blue-500 to-indigo-600 
          hover:shadow-xl hover:scale-105
          transition-all duration-300
          ${isAnimating ? 'animate-pulse scale-105' : ''}
        `}
      >
        <User className={`w-4 h-4 ${isAnimating ? 'animate-bounce' : ''}`} /> 
        {isDebugging ? "Create Your Profile (Debug)" : "Create Your Profile"}
        <ArrowRight className={`w-4 h-4 ${isAnimating ? 'translate-x-1' : ''} transition-transform`} />
      </div>
    </Link>
  );
}
