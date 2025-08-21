"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LeadCaptureModal } from "~/components/modals/LeadCaptureModal";
import { useLeadCapture } from "~/hooks/useLeadCapture";

export default function HomeRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to homepage
    router.push("/");
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to homepage...</p>
      <Link href="/" className="text-blue-500 underline ml-2">
        Click here if you are not redirected automatically
      </Link>
    </div>
  );
}
