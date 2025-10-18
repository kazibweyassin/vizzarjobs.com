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
      className="relative bg-kale min-h-screen w-full overflow-hidden"
    >
      {/* Enhanced background with video */}
      <div className="absolute inset-0 z-0">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/background.mp4" type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
            }}
          ></div>
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-kale/70"></div>
        
        {/* Subtle geometric patterns for depth */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-light-green rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("/grid-pattern.svg")',
          backgroundSize: '60px 60px',
          backgroundPosition: 'center',
          opacity: 0.1
        }}></div>
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
            <div className="w-8 h-8 bg-teal-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Global Talent Pool Platform</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
          >
            <span className="block">Join Our Global Talent Pool.</span>
            <span className="block text-teal-400">
              Get discovered by employers worldwide.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-3xl">
            Connect with <span className="text-white font-semibold">top employers</span> offering 
            <span className="text-white font-semibold"> visa sponsorship</span> and 
            <span className="text-teal-400 font-semibold"> relocation support</span> from 
            <span className="text-white font-semibold"> 15+ countries</span> worldwide.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-6">
            {/* Primary CTA */}
            <div className="flex flex-wrap gap-4">
              <Link href="/career-assessment">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold shadow-xl bg-emerald text-lg"
                >
                  <User className="w-5 h-5" /> Take Career Assessment <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>

              <Link href="/talent-pool/register">
                <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-white font-medium shadow-lg bg-blue-600">
                  Join Talent Pool <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>

            {/* Secondary CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/how-it-works">
                <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-gray-200 font-medium border border-white/10 backdrop-blur">
                  How it works
                </motion.div>
              </Link>

              <Link href="/resources">
                <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-gray-200 font-medium border border-white/10 backdrop-blur">
                  Career Resources
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* credibility row */}
          <motion.div variants={fadeUp} className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 text-gray-300">
            <div className="flex items-center gap-2"><User className="w-5 h-5 text-teal-300" /><span>500+ Candidates</span></div>
            <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-300" /><span>15+ Countries</span></div>
            <div className="flex items-center gap-2"><Award className="w-5 h-5 text-yellow-300" /><span>Visa Sponsorship</span></div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-blue-300" /><span>95% Success Rate</span></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
