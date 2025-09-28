"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

export function NavigationProfileButton() {
  const { data: session } = useSession();
  
  // Determine the correct href based on authentication status
  const href = session?.user ? "/onboarding" : "/auth/signin?callbackUrl=/onboarding";
  
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
    >
      <User className="w-4 h-4" />
      Create Your Profile
    </Link>
  );
}
