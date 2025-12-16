"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Users,
  Building2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to home</span>
          </Link>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-6 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
            <span>Join VizzarJobs</span>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Choose your account type
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Select how you want to join our platform
          </p>
        </div>

        {/* Options */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {/* Job Seeker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/auth/signup/job-seeker">
              <div className="group relative rounded-lg bg-white/5 p-8 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                    <Users className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    I'm a Job Seeker
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Find your dream job across East Africa
                  </p>
                  <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Employer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/auth/signup/employer">
              <div className="group relative rounded-lg bg-white/5 p-8 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                    <Building2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    I'm an Employer
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Hire talented professionals for your team
                  </p>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
