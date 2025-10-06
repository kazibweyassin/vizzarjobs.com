"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Shield, Sparkles, Award, Globe } from 'lucide-react';

// Floating particles component
const FloatingParticle = ({ delay = 0, duration = 4 }) => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  
  // Use client-side only position calculation to avoid hydration mismatch
  useEffect(() => {
    setPosition({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`
    });
  }, []);

  return (
    <motion.div
      className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
      animate={{
        y: [-20, -100, -20],
        x: [-10, 10, -10],
        scale: [0.5, 1, 0.5],
        opacity: [0.2, 0.5, 0.2]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      style={position}
    />
  );
};

// Animated rating stars
const AnimatedStars = ({ rating = 5, delay = 0 }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            delay: delay + i * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.3,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.3 }
          }}
        >
          <Star 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            aria-hidden="true" 
          />
        </motion.div>
      ))}
    </div>
  );
};

// Typewriter effect for testimonial text
const TypewriterText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay + currentIndex * 20);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <motion.p 
      className="text-xl text-gray-700 italic leading-relaxed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      "{displayText}"
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </motion.p>
  );
};

export function PremiumTestimonials() {
  const testimonials = [
    {
      content: "VizzarJobs completely changed my career trajectory. Within weeks of signing up, I received an offer from a Fortune 500 company with full visa sponsorship.",
      author: "David Omondi",
      role: "Senior Software Engineer",
      company: "Microsoft",
      location: "Seattle, USA",
      image: "/images/profiles/profile1.jpg",
      rating: 5,
      bgColor: "from-blue-500 to-blue-600",
      accentColor: "blue"
    },
    {
      content: "The quality of opportunities on VizzarJobs is unmatched. The platform's focus on visa sponsorship removed the biggest barrier in my international job search.",
      author: "Amara Nwosu",
      role: "Product Manager",
      company: "Shopify",
      location: "Toronto, Canada",
      image: "/images/profiles/profile2.jpg",
      rating: 5,
      bgColor: "from-emerald-500 to-teal-600",
      accentColor: "emerald"
    },
    {
      content: "What sets VizzarJobs apart is their elite vetting process. Every position I applied to was legitimate, with clear visa sponsorship details and competitive compensation.",
      author: "Kwame Mensah",
      role: "DevOps Engineer",
      company: "Atlassian",
      location: "Sydney, Australia",
      image: "/images/about/cto.jpg",
      rating: 5,
      bgColor: "from-blue-500 to-blue-600",
      accentColor: "purple"
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { scrollY } = useScroll();
  const ref = useRef(null);
  const isInView = useInView(ref);

  // Parallax effect for quote decoration
  const quoteY = useTransform(scrollY, [0, 1000], [0, -50]);
  const quoteRotate = useTransform(scrollY, [0, 1000], [0, 15]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const selectTestimonial = (index) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[activeIndex];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 80,
        damping: 20,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const testimonialVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    })
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 sm:py-24 relative overflow-hidden">
      {/* Floating background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} duration={4 + i * 0.3} />
        ))}
      </div>

      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div 
          className="mx-auto max-w-2xl text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          ref={ref}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center mb-4"
          >
            <motion.div
              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Success Stories</span>
            </motion.div>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl bg-gradient-to-r from-gray-900 via-blue-700 to-blue-700 bg-clip-text text-transparent"
          >
            Transforming Careers Globally
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Real stories from professionals who've transformed their careers through VizzarJobs
          </motion.p>
        </motion.div>

        <motion.div 
          className="relative mx-auto max-w-5xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Decorative quote with parallax */}
          <motion.div 
            className="absolute -left-16 -top-16 hidden lg:block"
            style={{ y: quoteY, rotate: quoteRotate }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Quote className="h-32 w-32 text-blue-100 rotate-180 opacity-60" />
            </motion.div>
          </motion.div>

          {/* Main testimonial card */}
          <motion.div 
            className="relative overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Animated background gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${currentTestimonial.bgColor} opacity-5`}
              key={activeIndex}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.05 }}
              transition={{ duration: 1 }}
            />

            <AnimatePresence mode="wait" custom={activeIndex}>
              <motion.div
                key={activeIndex}
                custom={activeIndex}
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="px-6 py-12 sm:px-12 relative z-10"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3">
                    {/* Animated stars */}
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <AnimatedStars rating={currentTestimonial.rating} delay={0.5} />
                    </motion.div>

                    {/* Typewriter testimonial text */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <TypewriterText text={currentTestimonial.content} delay={800} />
                    </motion.div>

                    {/* Author information with animations */}
                    <motion.div 
                      className="mt-10 flex items-center gap-4"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
                    >
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.img
                          src={currentTestimonial.image}
                          alt={currentTestimonial.author}
                          className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                        />
                        
                        {/* Animated ring around avatar */}
                        <motion.div
                          className={`absolute inset-0 rounded-full border-2 border-${currentTestimonial.accentColor}-400`}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                      >
                        <motion.h4 
                          className="font-semibold text-gray-900 flex items-center gap-2"
                          whileHover={{ x: 5 }}
                        >
                          {currentTestimonial.author}
                          <motion.span 
                            className={`flex items-center bg-${currentTestimonial.accentColor}-50 border border-${currentTestimonial.accentColor}-100 rounded-full px-2 py-0.5`}
                            whileHover={{ scale: 1.1 }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                          >
                            <Shield className={`h-3 w-3 text-${currentTestimonial.accentColor}-600 mr-1`} />
                            <span className={`text-xs font-medium text-${currentTestimonial.accentColor}-700`}>Verified</span>
                          </motion.span>
                        </motion.h4>
                        
                        <motion.p 
                          className="text-sm text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4 }}
                        >
                          {currentTestimonial.role} @ {currentTestimonial.company}
                        </motion.p>
                        
                        <motion.p 
                          className={`text-sm text-${currentTestimonial.accentColor}-600 flex items-center gap-1`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 }}
                        >
                          <Globe className="w-3 h-3" />
                          {currentTestimonial.location}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Elite opportunity panel */}
                  <motion.div 
                    className={`hidden lg:flex lg:col-span-2 items-center justify-center bg-gradient-to-br from-${currentTestimonial.accentColor}-50 to-${currentTestimonial.accentColor}-100 rounded-2xl relative overflow-hidden`}
                    initial={{ opacity: 0, x: 100, rotateY: 45 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 80 }}
                  >
                    {/* Floating icons */}
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Award className={`w-6 h-6 text-${currentTestimonial.accentColor}-300`} />
                    </motion.div>

                    <div className="text-center py-8 px-6 relative z-10">
                      <motion.div 
                        className="w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -10, 10, 0]
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div 
                          className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentTestimonial.bgColor} flex items-center justify-center`}
                          animate={{ 
                            boxShadow: [
                              "0 0 0 0 rgba(59, 130, 246, 0.4)",
                              "0 0 0 20px rgba(59, 130, 246, 0)",
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-lg font-semibold text-gray-900 mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                      >
                        Elite Opportunity
                      </motion.h3>
                      
                      <motion.p 
                        className="text-sm text-gray-600 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        Every testimonial represents a successful career transition with full visa sponsorship
                      </motion.p>
                      
                      <motion.div 
                        className={`inline-block bg-white rounded-full px-4 py-2 text-sm font-medium text-${currentTestimonial.accentColor}-700 shadow-sm`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        100% Visa Sponsorship Success Rate
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Enhanced Navigation Controls */}
            <motion.div 
              className="absolute bottom-4 right-4 flex space-x-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.1,
                  rotate: -5,
                  backgroundColor: "#f8fafc"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </motion.button>
              
              <motion.button
                onClick={nextTestimonial}
                className={`p-3 rounded-full bg-gradient-to-r ${currentTestimonial.bgColor} shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </motion.button>
            </motion.div>
            
            {/* Enhanced Indicator Dots */}
            <motion.div 
              className="absolute bottom-4 left-4 flex space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => selectTestimonial(index)}
                  className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-8 h-3' : 'w-3 h-3'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className={`w-full h-full rounded-full ${
                      index === activeIndex 
                        ? `bg-gradient-to-r ${testimonials[index].bgColor}` 
                        : 'bg-gray-300'
                    }`}
                    layoutId={index === activeIndex ? "activeIndicator" : undefined}
                  />
                  
                  {/* Progress indicator for active testimonial */}
                  {index === activeIndex && isAutoPlaying && (
                    <motion.div
                      className="absolute inset-0 bg-white opacity-30 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      key={`progress-${activeIndex}`}
                    />
                  )}
                  
                  <span className="sr-only">View testimonial {index + 1}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Auto-play indicator */}
          <motion.div
            className="absolute top-4 right-4 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <motion.button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`p-2 rounded-full text-xs font-medium transition-all ${
                isAutoPlaying 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAutoPlaying ? '⏸️' : '▶️'}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}