"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Globe, Sparkles, ArrowRight, Shield, Award, Briefcase } from "lucide-react";
import { motion, easeInOut } from "framer-motion";

export function PremiumHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If search query is empty, just navigate to jobs page
    if (!searchQuery.trim()) {
      router.push('/jobs');
      return;
    }
    
    // Encode the search query for URL
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    
    // Redirect to jobs page with search query
    router.push(`/jobs?search=${encodedQuery}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: easeInOut }
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-10 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 hidden lg:block">
        <div className="w-64 h-64 rounded-full opacity-10 bg-blue-600 blur-[100px]" />
      </div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 hidden lg:block">
        <div className="w-64 h-64 rounded-full opacity-10 bg-purple-600 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.015] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Elite Tag */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="text-sm font-medium text-gray-800">Elite Opportunities • Visa Sponsorship</span>
          </motion.div>
          
          {/* Main heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900"
          >
            Elevate Your Career with<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              Global Opportunities
            </span>
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Connecting elite African tech talent with premium visa-sponsored positions at world-class companies.
          </motion.p>
          
          {/* Search Box */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, technology, or location..."
                className="block w-full pl-12 pr-32 py-4 rounded-xl text-gray-900 bg-white border border-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
              />
              <div className="absolute inset-y-0 right-0 mr-1.5 flex items-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
          
          {/* Trust Badges */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-5 sm:gap-8 pt-4"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Vetted Opportunities</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Visa Sponsorship</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Premium Employers</span>
            </div>
          </motion.div>
          
          {/* Action Links */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <Link 
              href="/jobs" 
              className="inline-flex items-center gap-2 px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium hover:shadow-lg transition duration-300"
            >
              <Briefcase className="w-4 h-4" />
              Browse Elite Positions
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link 
              href="/how-it-works" 
              className="inline-flex items-center gap-2 px-8 py-3 text-gray-700 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition duration-300"
            >
              How It Works
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
