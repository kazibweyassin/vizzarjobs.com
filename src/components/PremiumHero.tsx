"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Globe, Sparkles, ArrowRight, Shield, Award, Briefcase } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { jobEvents } from "~/lib/analytics";

export function PremiumHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  
  // Advanced scroll and mouse tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const isInView = useInView(heroRef, { once: true, margin: "-100px" });
  
  // Smooth spring animations
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.8], [1, 0]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.98]), springConfig);
  
  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      setMousePosition({ x: x * 20, y: y * 20 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      router.push('/jobs');
      return;
    }
    
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    jobEvents.search(searchQuery.trim(), 0);
    router.push(`/jobs?search=${encodedQuery}`);
  };

  // Ultra-advanced animation variants
  const masterContainer = {
    hidden: { 
      opacity: 0,
    },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.2,
        staggerChildren: 0.12,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const floatingElement = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -15,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8
      }
    }
  };

  const magneticHover = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.05, 
      rotate: [0, -1, 1, 0],
      transition: { 
        scale: { duration: 0.3 },
        rotate: { 
          duration: 0.6, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    }
  };

  const glowPulse = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 40px rgba(59, 130, 246, 0.6)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textReveal = {
    hidden: { 
      opacity: 0,
      y: 100,
      clipPath: "inset(100% 0 0 0)"
    },
    visible: { 
      opacity: 1,
      y: 0,
      clipPath: "inset(0% 0 0 0)",
      transition: { 
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3
      }
    }
  };

  const searchBoxVariants = {
    rest: { 
      scale: 1,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
    },
    focused: { 
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
      borderColor: "#3B82F6",
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const badgeFloat = {
    animate: {
      y: [0, -8, 0],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        staggerChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      style={{ y, opacity, scale }}
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-10 pb-20 lg:pt-20 lg:pb-28"
    >
      {/* Advanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 bg-gradient-to-br from-blue-400 to-purple-600 blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.3}px)`
          }}
        />
        
        <motion.div 
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 bg-gradient-to-tr from-indigo-500 to-cyan-400 blur-[100px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * 0.2}px)`
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-3/4 right-1/3 w-6 h-6 border-2 border-purple-400 rotate-45 opacity-40"
          animate={{
            rotate: [45, 225, 45],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Animated Grid Pattern */}
      <motion.div 
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02] pointer-events-none"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={heroRef}
          className="text-center max-w-4xl mx-auto space-y-8"
          variants={masterContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Premium Elite Badge with Advanced Animations */}
          <motion.div 
            variants={floatingElement}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-blue-100/50 shadow-lg hover:shadow-xl transition-all duration-500"
            whileHover="hover"
            initial="rest"
            variants={magneticHover}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div 
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden"
              variants={glowPulse}
              animate="animate"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <Sparkles className="h-4 w-4 text-white relative z-10" />
            </motion.div>
            
            <motion.span 
              className="text-sm font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              Elite Opportunities • Visa Sponsorship
            </motion.span>
            
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Revolutionary Main Heading */}
          <div className="relative">
            <motion.h1 
              variants={textReveal}
              className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight"
              style={{
                perspective: "1000px"
              }}
            >
              <motion.span
                className="block transform-gpu"
                animate={{
                  rotateX: [0, 2, 0],
                  rotateY: [0, -1, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Elevate Your Career with
              </motion.span>
              <br />
              <motion.span 
                className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: "300% 300%"
                }}
              >
                Global Opportunities
                
                {/* Animated underline */}
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.5,
                    delay: 1.5,
                    ease: "easeOut"
                  }}
                />
              </motion.span>
            </motion.h1>
            
            {/* Floating particles around heading */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Enhanced Description */}
          <motion.p 
            variants={floatingElement}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{
              transform: `translateY(${mousePosition.y * 0.1}px)`
            }}
          >
            Connecting elite African tech talent with premium visa-sponsored positions at{" "}
            <motion.span
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              world-class companies
            </motion.span>.
          </motion.p>
          
          {/* Revolutionary Search Box */}
          <motion.div 
            variants={floatingElement} 
            className="max-w-2xl mx-auto"
          >
            <motion.form 
              onSubmit={handleSearch} 
              className="relative group"
              variants={searchBoxVariants}
              animate={isSearchFocused ? "focused" : "rest"}
              whileHover={{ y: -2 }}
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <motion.div
                  animate={{
                    rotate: isSearchFocused ? 360 : 0,
                    scale: isSearchFocused ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Search className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
              
              <motion.input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search by job title, technology, or location..."
                className="block w-full pl-12 pr-36 py-5 rounded-2xl text-gray-900 bg-white/90 backdrop-blur-md border-2 border-gray-200/50 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-500"
                whileFocus={{ scale: 1.01 }}
              />
              
              <div className="absolute inset-y-0 right-0 mr-2 flex items-center">
                <motion.button
                  type="submit"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg overflow-hidden relative"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Search</span>
                </motion.button>
              </div>
              
              {/* Search box glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ zIndex: -1 }}
              />
            </motion.form>
          </motion.div>
          
          {/* Advanced Trust Badges */}
          <motion.div 
            variants={floatingElement}
            className="flex flex-wrap justify-center gap-6 sm:gap-10 pt-6"
          >
            {[
              { icon: Shield, text: "Vetted Opportunities", delay: 0 },
              { icon: Globe, text: "Visa Sponsorship", delay: 0.1 },
              { icon: Award, text: "Premium Employers", delay: 0.2 }
            ].map((badge, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-sm text-gray-600 group cursor-pointer"
                variants={badgeFloat}
                animate="animate"
                style={{ animationDelay: `${badge.delay}s` }}
                whileHover={{ 
                  scale: 1.1,
                  y: -5
                }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <badge.icon className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  <motion.div
                    className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <motion.span
                  className="font-medium group-hover:text-gray-800 transition-colors duration-300"
                  whileHover={{ x: 2 }}
                >
                  {badge.text}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Premium Action Links */}
          <motion.div 
            variants={floatingElement}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-6"
          >
            <Link href="/jobs">
              <motion.div
                className="inline-flex items-center gap-3 px-10 py-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.5 }}
                />
                <Briefcase className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Browse Elite Positions</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </Link>
            
            {[
              { href: "/how-it-works", text: "How It Works" },
              { href: "/why-us", text: "Why Choose Us" }
            ].map((link, index) => (
              <Link key={index} href={link.href}>
                <motion.div
                  className="inline-flex items-center gap-2 px-8 py-4 text-gray-700 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-500 group"
                  whileHover={{ 
                    scale: 1.03, 
                    y: -2,
                    backgroundColor: "rgba(255, 255, 255, 0.95)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    transform: `translateY(${mousePosition.y * 0.05}px)`
                  }}
                >
                  <span className="group-hover:text-blue-600 transition-colors duration-300">
                    {link.text}
                  </span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Dynamic Sample Jobs Section */}
        <motion.div 
          variants={floatingElement}
          className="mt-16 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <motion.h3 
            className="text-center text-lg font-semibold text-gray-700 mb-8"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🔥 Trending Opportunities
          </motion.h3>
          
          <div className="relative w-full overflow-hidden h-32">
            <motion.div 
              className="flex space-x-6 items-center absolute"
              animate={{
                x: [0, -100 * 12]
              }}
              transition={{
                duration: 50,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {[...Array(3)].map((_, setIndex) => 
                [
                  {
                    title: "Senior React Developer",
                    company: "Microsoft",
                    location: "Seattle, WA",
                    salary: "$140k - $180k",
                    type: "Full-time",
                    skills: ["React", "TypeScript", "Node.js"],
                    urgent: true
                  },
                  {
                    title: "DevOps Engineer",
                    company: "Google",
                    location: "Mountain View, CA",
                    salary: "$130k - $170k",
                    type: "Full-time",
                    skills: ["AWS", "Kubernetes", "Docker"],
                    urgent: false
                  },
                  {
                    title: "ML Engineer",
                    company: "Meta",
                    location: "Menlo Park, CA",
                    salary: "$160k - $220k",
                    type: "Full-time",
                    skills: ["Python", "TensorFlow", "PyTorch"],
                    urgent: true
                  },
                  {
                    title: "Full Stack Developer",
                    company: "Netflix",
                    location: "Los Gatos, CA",
                    salary: "$125k - $165k",
                    type: "Full-time",
                    skills: ["Vue.js", "Java", "MongoDB"],
                    urgent: false
                  },
                  {
                    title: "Cloud Architect",
                    company: "Amazon",
                    location: "Austin, TX",
                    salary: "$150k - $200k",
                    type: "Full-time",
                    skills: ["AWS", "Terraform", "Python"],
                    urgent: true
                  },
                  {
                    title: "iOS Developer",
                    company: "Apple",
                    location: "Cupertino, CA",
                    salary: "$135k - $175k",
                    type: "Full-time",
                    skills: ["Swift", "SwiftUI", "Xcode"],
                    urgent: false
                  },
                  {
                    title: "Data Scientist",
                    company: "Tesla",
                    location: "Palo Alto, CA",
                    salary: "$145k - $185k",
                    type: "Full-time",
                    skills: ["Python", "R", "SQL"],
                    urgent: true
                  },
                  {
                    title: "Security Engineer",
                    company: "Stripe",
                    location: "San Francisco, CA",
                    salary: "$140k - $190k",
                    type: "Full-time",
                    skills: ["Cybersecurity", "Penetration Testing"],
                    urgent: false
                  },
                  {
                    title: "Product Manager",
                    company: "Spotify",
                    location: "New York, NY",
                    salary: "$120k - $160k",
                    type: "Full-time",
                    skills: ["Product Strategy", "Analytics"],
                    urgent: true
                  },
                  {
                    title: "Backend Engineer",
                    company: "Airbnb",
                    location: "San Francisco, CA",
                    salary: "$130k - $170k",
                    type: "Full-time",
                    skills: ["Go", "PostgreSQL", "Redis"],
                    urgent: false
                  },
                  {
                    title: "Frontend Developer",
                    company: "Uber",
                    location: "San Francisco, CA",
                    salary: "$125k - $165k",
                    type: "Full-time",
                    skills: ["React", "Redux", "CSS"],
                    urgent: true
                  },
                  {
                    title: "AI Research Scientist",
                    company: "OpenAI",
                    location: "San Francisco, CA",
                    salary: "$180k - $250k",
                    type: "Full-time",
                    skills: ["Python", "Deep Learning", "Research"],
                    urgent: false
                  }
                ].map((job, i) => (
                  <motion.div
                    key={`${setIndex}-${i}`}
                    className="flex-shrink-0 w-80 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-gray-100/50 relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      zIndex: 10,
                      backgroundColor: "rgba(255, 255, 255, 0.98)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/jobs')}
                    style={{
                      background: job.urgent 
                        ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,240,138,0.1) 100%)"
                        : "rgba(255,255,255,0.9)"
                    }}
                  >
                    {/* Urgent Badge */}
                    <AnimatePresence>
                      {job.urgent && (
                        <motion.div
                          className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold"
                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            rotate: 0,
                            boxShadow: ["0 0 0 rgba(239, 68, 68, 0)", "0 0 20px rgba(239, 68, 68, 0.3)", "0 0 0 rgba(239, 68, 68, 0)"]
                          }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ 
                            duration: 0.3,
                            boxShadow: { duration: 2, repeat: Infinity }
                          }}
                        >
                          🚨 URGENT
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ zIndex: -1 }}
                    />
                    
                    <div className="space-y-4">
                      {/* Job Title & Company */}
                      <div>
                        <motion.h4 
                          className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300"
                          whileHover={{ x: 2 }}
                        >
                          {job.title}
                        </motion.h4>
                        <motion.p 
                          className="text-gray-600 font-medium flex items-center gap-2"
                          animate={{
                            color: job.urgent ? ["#6B7280", "#3B82F6", "#6B7280"] : "#6B7280"
                          }}
                          transition={{
                            duration: 2,
                            repeat: job.urgent ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {job.company}
                          <motion.span
                            className="w-2 h-2 bg-green-500 rounded-full"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [1, 0.7, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </motion.p>
                      </div>
                      
                      {/* Location & Salary */}
                      <div className="flex justify-between items-center text-sm">
                        <motion.span 
                          className="text-gray-600 flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          📍 {job.location}
                        </motion.span>
                        <motion.span 
                          className="font-semibold text-green-600"
                          animate={{
                            scale: job.urgent ? [1, 1.05, 1] : 1
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: job.urgent ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {job.salary}
                        </motion.span>
                      </div>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, skillIndex) => (
                          <motion.span
                            key={skillIndex}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium group-hover:bg-blue-200 transition-colors duration-300"
                            whileHover={{ 
                              scale: 1.1,
                              backgroundColor: "rgb(147 197 253)"
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: skillIndex * 0.1 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                      
                      {/* Apply Button */}
                      <motion.div
                        className="pt-2"
                        whileHover={{ y: -2 }}
                      >
                        <motion.button
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300 relative overflow-hidden"
                          whileHover={{ 
                            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.6 }}
                          />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Apply Now
                            <motion.div
                              animate={{ x: [0, 3, 0] }}
                              transition={{ 
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </motion.div>
                          </span>
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
            
            {/* Gradient Overlays for Smooth Edges */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-blue-50 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-blue-50 to-transparent pointer-events-none z-10" />
          </div>
        </motion.div>
        
        {/* Revolutionary Logo Ticker */}
        <motion.div 
          variants={floatingElement}
          className="mt-20 pt-10 border-t border-gray-200/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.p 
            className="text-center text-sm font-semibold text-gray-500 mb-8"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Trusted by leading global companies to source top talent
          </motion.p>
          
          <div className="relative w-full overflow-hidden">
            <motion.div 
              className="flex space-x-16 items-center"
              animate={{
                x: [0, -100 * 8]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {[...Array(3)].map((_, setIndex) => 
                [
                  { src: "/companies/cousera.svg", alt: "Coursera" },
                  { src: "/companies/cloudflare.svg", alt: "Cloudflare" },
                  { src: "/companies/logo3.svg", alt: "Company 3" },
                  { src: "/companies/mind.svg", alt: "Mind" },
                  { src: "/companies/logo5.svg", alt: "Company 5" },
                  { src: "/companies/weather.svg", alt: "Weather" },
                  { src: "/companies/cloudflare.svg", alt: "Cloudflare" },
                  { src: "/companies/github.svg", alt: "GitHub" }
                ].map((company, i) => (
                  <motion.div
                    key={`${setIndex}-${i}`}
                    className="flex-shrink-0 w-40 h-16 bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer"
                    whileHover={{ 
                      scale: 1.1, 
                      y: -5,
                      backgroundColor: "rgba(255, 255, 255, 0.9)"
                    }}
                  >
                    <img 
                      src={company.src} 
                      alt={company.alt} 
                      className="h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}