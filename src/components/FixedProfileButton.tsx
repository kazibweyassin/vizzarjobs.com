"use client";

import Link from "next/link";
import { User, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function FixedProfileButton() {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation effect
  useEffect(() => {
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
  }, []);
  
  return (
    <Link href="/onboarding" className="z-50">
      <div 
        className={`
          inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold shadow-lg 
          bg-gradient-to-r from-purple-500 to-indigo-600 
          hover:shadow-xl hover:scale-105
          transition-all duration-300
          ${isAnimating ? 'animate-pulse scale-105' : ''}
        `}
      >
        <User className={`w-4 h-4 ${isAnimating ? 'animate-bounce' : ''}`} /> 
        Complete Your Profile
        <ArrowRight className={`w-4 h-4 ${isAnimating ? 'translate-x-1' : ''} transition-transform`} />
      </div>
    </Link>
  );
}
