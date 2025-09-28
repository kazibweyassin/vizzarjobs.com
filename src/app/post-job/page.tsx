"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PostJobForm } from "~/components/PostJobForm";

export default function PostJobPage() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/post-job');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading session...</p>
      </div>
    );
  }

  if (!sessionData) {
    return null; // This prevents flash of content before redirect
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Post a New Job</h1>
        <p className="text-center text-gray-600 mb-8">Create a job posting to attract qualified candidates</p>
        
        <PostJobForm />
      </div>
    </div>
  );
}
