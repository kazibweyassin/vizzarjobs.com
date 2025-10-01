"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Briefcase, Globe, Award, Shield, User } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { jobEvents } from "~/lib/analytics";
import { useSession } from "next-auth/react";

export function PremiumHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { data: session } = useSession();

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const isInView = useInView(heroRef, { once: true, margin: "-100px" });

  // springs
  const springConfig = { stiffness: 100, damping: 30 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.8], [1, 0]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.98]), springConfig);

  // No longer needed since we're not using the video
  useEffect(() => {
    setVideoLoaded(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/jobs");
      return;
    }
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    jobEvents.search(searchQuery.trim(), 0);
    router.push(`/jobs?search=${encodedQuery}`);
  };

  // motion variants
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.15 } }
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    }
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ y, opacity, scale, position: 'relative' }}
      className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 min-h-screen w-full overflow-hidden"
    >
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-teal-900/90 to-emerald-900/90"></div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("/grid-pattern.svg")',
          backgroundSize: '60px 60px',
          backgroundPosition: 'center',
          opacity: 0.1
        }}></div>
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center pt-24 pb-32">
        <motion.div
          ref={heroRef}
          className="w-full max-w-3xl text-left space-y-10"
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-sm text-white shadow-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Visa-Sponsored Careers for African Talent</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
          >
            <span className="block">Elevate your career.</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-500 animate-gradient-x">
              Global opportunities, simplified.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-3xl">
            Connect with <span className="text-white font-semibold">Fortune 500 companies</span> and 
            <span className="text-white font-semibold"> fast-growing startups</span> offering 
            <span className="text-teal-400 font-semibold"> visa sponsorship</span> for African professionals.
          </motion.p>

          {/* search + CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-6">
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
              <div className="relative w-full sm:w-96">
                <input
                  aria-label="Search jobs"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, skills, or location"
                  className="w-full px-6 py-4 rounded-2xl text-gray-900 bg-white/95 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-lg shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-6 py-2 rounded-xl font-semibold text-white text-base shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#00e6d3,#0077ff)" }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* secondary CTAs */}
            <div className="flex flex-wrap gap-4">
              {session?.user && !session.user.profileComplete && (
                <Link href={session?.user ? "/onboarding" : "/auth/signin?callbackUrl=/onboarding"}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600"
                  >
                    <User className="w-4 h-4" /> Create Your Profile <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              )}
              
              <Link href="/jobs">
                <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg bg-gradient-to-r from-teal-400 to-blue-600">
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>

              <Link href="/how-it-works">
                <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-gray-200 font-medium border border-white/10 backdrop-blur">
                  How it works
                </motion.div>
              </Link>

              <Link href="/jobs">
                <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg bg-gradient-to-r from-teal-400 to-blue-600">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>

              <Link href="/post-job">
                <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-gray-900 font-medium shadow-lg bg-gradient-to-r from-teal-100 to-blue-300">
                  Want to Hire Talent? <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* credibility row */}
          <motion.div variants={fadeUp} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-gray-300">
            <div className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-teal-300" /><span>1000+ Jobs</span></div>
            <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-300" /><span>Global Reach</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-yellow-300" /><span>Elite Talent</span></div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-300" /><span>Trusted Platform</span></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
