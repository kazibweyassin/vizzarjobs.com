"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Building2,
  ArrowRight,
  Plane,
} from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-4">
            <Plane className="w-3.5 h-3.5" />
            VizzarJobs
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Choose how you want to use VizzarJobs</p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Job Seeker */}
          <Link href="/auth/signup/job-seeker">
            <div className="group bg-white rounded-xl border border-gray-200 hover:border-[#0F2C4C] p-7 cursor-pointer transition-all hover:shadow-md">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-[#0F2C4C]/10 flex items-center justify-center mb-4 transition-colors">
                  <Users className="w-7 h-7 text-gray-500 group-hover:text-[#0F2C4C] transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">I&apos;m a Job Seeker</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Browse visa-sponsored jobs abroad
                </p>
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F2C4C] group-hover:gap-2.5 transition-all">
                  Get started <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Employer */}
          <Link href="/auth/signup/employer">
            <div className="group bg-white rounded-xl border border-gray-200 hover:border-amber-500 p-7 cursor-pointer transition-all hover:shadow-md">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-amber-50 flex items-center justify-center mb-4 transition-colors">
                  <Building2 className="w-7 h-7 text-gray-500 group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">I&apos;m an Employer</h3>
                <p className="text-sm text-gray-500 mb-5">
                  Post jobs &amp; find global talent
                </p>
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 group-hover:gap-2.5 transition-all">
                  Post a job <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold text-[#0F2C4C] hover:text-amber-600 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}


