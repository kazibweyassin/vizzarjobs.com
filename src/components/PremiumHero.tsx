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
      // For empty search, navigate to jobs with East Africa filter pre-selected
      router.push("/jobs?location=East Africa");
      return;
    }
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    jobEvents.search(searchQuery.trim(), 0);
    // Add East Africa as default location for all searches
    router.push(`/jobs?search=${encodedQuery}&location=East Africa`);
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
    <div
      ref={containerRef}
      className="relative bg-white w-full overflow-hidden"
    >
      {/* Clean split background design - Andela-inspired */}
      <div className="absolute inset-0 z-0 flex">
        {/* Clean solid color half */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Right half with subtle image */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 lg:w-3/5">
          <div 
            className="h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1525876774895-97b68a156dbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
              opacity: 0.92
            }}
          >
            <div className="absolute inset-0 bg-navy/20"></div>
          </div>
        </div>
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
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-navy/10 text-sm text-navy">
            <div className="w-6 h-6 bg-navy rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold">East Africa Job Opportunities</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
          >
            <span className="block">Find Your Tech Dream Job</span>
            <span className="block text-navy">
              in East Africa
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            Connect with <span className="text-navy font-medium">leading companies</span> looking for 
            skilled professionals across major cities including 
            <span className="text-navy font-medium"> Kampala, Nairobi, and Kigali</span>.
          </motion.p>

          {/* CTAs - Andela-inspired clean design */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4">
            {/* Primary CTA */}
            <div className="flex flex-wrap gap-4">
              <Link href="/jobs?location=East Africa">
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-white font-medium bg-navy text-base transition-all"
                >
                  <Briefcase className="w-4 h-4" /> Browse Jobs in East Africa <ArrowRight className="w-4 h-4 ml-1" />
                </motion.div>
              </Link>

              <Link href="/profile">
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-md text-navy font-medium border border-navy/30 bg-white transition-all"
                >
                  Complete Your Profile <ArrowRight className="w-4 h-4 ml-1" />
                </motion.div>
              </Link>
            </div>

            {/* Secondary CTAs */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/how-it-works">
                <motion.div className="inline-flex items-center gap-2 px-0 py-2 text-gray-600 font-medium hover:text-navy transition-colors">
                  How it works <ArrowRight className="w-3 h-3 ml-1" />
                </motion.div>
              </Link>

              <Link href="/post-job">
                <motion.div className="inline-flex items-center gap-2 px-0 py-2 text-gray-600 font-medium hover:text-navy transition-colors ml-6">
                  For Employers <ArrowRight className="w-3 h-3 ml-1" />
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* credibility row */}
          <motion.div variants={fadeUp} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-gray-600">
            <div className="flex items-center gap-2"><User className="w-5 h-5 text-navy" /><span>1000+ Jobs</span></div>
            <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-navy" /><span>Across East Africa</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-navy" /><span>Top Employers</span></div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-navy" /><span>Verified Listings</span></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
