"use client";

import { useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  ArrowRight, 
  CheckCircle, 
  Mail,
  Clock,
  UserCheck,
  Briefcase,
  GraduationCap,
  Globe,
  Search,
  FileCheck,
  Users,
  CheckSquare,
  ArrowUpRight,
  Calendar,
  Rocket,
  Lightbulb,
  Award,
  Star,
  HelpCircle,
  Zap,
  Target,
  Shield
} from "lucide-react";

// Question circle component with animation
const QuestionCircle = () => {
  return (
    <motion.div
      whileHover={{ rotate: 360, scale: 1.2 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <HelpCircle className="w-5 h-5 text-amber-500" />
    </motion.div>
  );
};

// Floating elements animation
const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
      rotate: [0, 2, 0]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
  >
    {children}
  </motion.div>
);

// Animated counter component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  
  return (
    <motion.div
      ref={ref}
      className="text-4xl md:text-5xl font-bold mb-2"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, ease: "backOut" }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: duration, ease: "easeOut" }}
        onAnimationComplete={() => {
          if (isInView) {
            // Animate the number counting up
            let current = 0;
            const increment = end / (duration * 60);
            const timer = setInterval(() => {
              current += increment;
              if (current >= end) {
                current = end;
                clearInterval(timer);
              }
              if (ref.current) {
                ref.current.textContent = Math.floor(current).toLocaleString() + suffix;
              }
            }, 1000 / 60);
          }
        }}
      >
        0{suffix}
      </motion.span>
    </motion.div>
  );
};

interface Step {
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface TabContent {
  title: string;
  description: string;
  steps: Step[];
  benefits: {
    title: string;
    description: string;
    icon: any;
    color: string;
  }[];
  cta: {
    text: string;
    link: string;
  };
}

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState("jobseekers");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const tabContents = {
    jobseekers: {
      title: "Your Path to Global Tech Opportunities",
      description: "We've streamlined the process of finding and applying for international tech roles with visa sponsorship",
      steps: [
        {
          title: "Create Your Profile",
          description: "Sign up and build a comprehensive profile highlighting your skills, experience, and career goals. Add your tech stack, preferred locations, and visa requirements.",
          icon: UserCheck,
          color: "bg-gradient-to-br from-blue-500 to-blue-600"
        },
        {
          title: "Discover Opportunities", 
          description: "Browse our curated selection of visa-sponsored tech positions from verified global employers actively seeking African talent.",
          icon: Search,
          color: "bg-gradient-to-br from-blue-600 to-blue-700"
        },
        {
          title: "Apply with Confidence",
          description: "Submit applications directly through our platform. Our streamlined process ensures employers see your complete profile and qualifications.",
          icon: CheckSquare,
          color: "bg-gradient-to-br from-green-500 to-green-600"
        },
        {
          title: "Interview and Succeed",
          description: "Connect with employers, showcase your talents in interviews, and receive support throughout the visa sponsorship and relocation process.",
          icon: Rocket,
          color: "bg-gradient-to-br from-amber-500 to-amber-600"
        }
      ],
      benefits: [
        {
          title: "Visa-Sponsored Roles",
          description: "All jobs on our platform offer visa sponsorship, saving you time searching for eligible positions.",
          icon: Globe,
          color: "text-blue-500"
        },
        {
          title: "Verified Employers",
          description: "We manually verify every company to ensure they have legitimate visa sponsorship capabilities.",
          icon: Shield,
          color: "text-green-500"
        },
        {
          title: "Career Growth",
          description: "Access global opportunities that accelerate your professional development and earning potential.",
          icon: Target,
          color: "text-blue-600"
        }
      ],
      cta: {
        text: "Browse Jobs",
        link: "/jobs"
      }
    },
    employers: {
      title: "Connect With Elite African Tech Talent",
      description: "Our simple process helps you find, verify, and hire exceptional tech professionals from Africa",
      steps: [
        {
          title: "Register Your Company",
          description: "Create an employer account and complete your company profile with details about your organization, visa sponsorship capabilities, and hiring needs.",
          icon: Building2,
          color: "bg-gradient-to-br from-blue-500 to-blue-600"
        },
        {
          title: "Post Visa-Sponsored Roles",
          description: "Create detailed job listings with comprehensive information about the position, requirements, benefits, and visa sponsorship details.",
          icon: Briefcase,
          color: "bg-gradient-to-br from-blue-600 to-blue-700"
        },
        {
          title: "Review Qualified Candidates",
          description: "Browse applications from pre-screened candidates who match your requirements and have the skills you need.",
          icon: FileCheck,
          color: "bg-gradient-to-br from-green-500 to-green-600"
        },
        {
          title: "Hire and Onboard",
          description: "Connect with promising candidates, conduct interviews, and get support throughout the hiring and visa sponsorship process.",
          icon: Users,
          color: "bg-gradient-to-br from-amber-500 to-amber-600"
        }
      ],
      benefits: [
        {
          title: "Talent Quality",
          description: "Access a pool of skilled and motivated African tech professionals eager for global opportunities.",
          icon: Award,
          color: "text-blue-500"
        },
        {
          title: "Streamlined Process",
          description: "Our platform handles the complexity of international hiring, from application to offer.",
          icon: Zap,
          color: "text-green-500"
        },
        {
          title: "Diversity Benefits",
          description: "Enrich your team with diverse perspectives, experiences, and innovative problem-solving approaches.",
          icon: Star,
          color: "text-blue-600"
        }
      ],
      cta: {
        text: "Post a Job",
        link: "/post-job"
      }
    }
  };
  
  const activeContent = tabContents[activeTab];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const stepVariants = {
    hidden: { 
      opacity: 0,
      x: -100,
      rotateY: -45
    },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        delay: i * 0.2,
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    }),
    hover: {
      scale: 1.05,
      rotateY: 5,
      z: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const benefitVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      rotateX: -30
    },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }),
    hover: {
      scale: 1.08,
      rotateX: 5,
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement delay={0}>
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-30" />
        </FloatingElement>
        <FloatingElement delay={1}>
          <div className="absolute top-40 right-20 w-6 h-6 bg-blue-400 rounded-full opacity-20" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="absolute bottom-40 left-20 w-5 h-5 bg-green-400 rounded-full opacity-25" />
        </FloatingElement>
      </div>

      {/* Hero Section with Parallax */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Animated background pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 2, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
        </motion.div>
        
        {/* Hero images */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-20 bottom-0 w-1/3 h-2/3">
            <img 
              src="/images/how-it-works/job-search.jpg" 
              alt="Professional searching for jobs"
              className="w-full h-full object-cover rounded-tl-3xl"
            />
          </div>
          <div className="absolute -left-20 top-10 w-1/4 h-1/2">
            <img 
              src="/images/how-it-works/candidate.jpg" 
              alt="Job candidate"
              className="w-full h-full object-cover rounded-br-3xl"
            />
          </div>
        </div>

        <motion.div 
          className="max-w-6xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            type: "spring", 
            stiffness: 80,
            damping: 20
          }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            How VizzarJobs Works
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Connecting exceptional African tech talent with global opportunities in a few simple steps
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Tab Selection with Enhanced Animations */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="bg-white rounded-xl shadow-md p-2 flex justify-center mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <motion.button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-lg flex-1 relative overflow-hidden ${
                activeTab === "jobseekers"
                  ? "text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("jobseekers")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence>
                {activeTab === "jobseekers" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    layoutId="activeTab"
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">For Job Seekers</span>
            </motion.button>
            <motion.button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 text-lg flex-1 relative overflow-hidden ${
                activeTab === "employers"
                  ? "text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("employers")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence>
                {activeTab === "employers" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    layoutId="activeTab"
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">For Employers</span>
            </motion.button>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 100, rotateY: 30 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -30 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
              className="text-center mb-10"
            >
              <motion.div
                className="mb-4 px-3 py-1 bg-blue-100 text-blue-800 border-blue-200 rounded-full inline-block"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {activeTab === "jobseekers" ? "For Job Seekers" : "For Employers"}
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {activeContent.title}
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {activeContent.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      
      {/* Process Steps with 3D Effects */}
      <section className="py-8 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
            {/* Animated Connection Line */}
            <motion.div 
              className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 transform -translate-y-1/2 z-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 2, ease: "easeOut" }}
            />
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {activeContent.steps.map((step, index) => (
                  <motion.div 
                    key={`${activeTab}-${index}`}
                    className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative perspective-1000"
                    variants={stepVariants}
                    custom={index}
                    whileHover="hover"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                    layout
                  >
                    {/* Animated Icon Container */}
                    <motion.div 
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.2
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="text-center pt-10 pb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <motion.h3 
                        className="text-2xl font-semibold mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.9 }}
                      >
                        {step.description}
                      </motion.p>
                    </motion.div>

                    {/* Step number indicator */}
                    <motion.div 
                      className="absolute bottom-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: index * 0.1 + 1.2,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {index + 1}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section with Staggered Animations */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Why Use VizzarJobs?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {activeTab === "jobseekers" 
                ? "We focus exclusively on connecting African tech talent with global opportunities"
                : "Find exceptional tech talent ready for international roles and visa sponsorship"}
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {activeContent.benefits.map((benefit, index) => (
              <motion.div 
                key={benefit.title}
                className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 cursor-pointer"
                variants={benefitVariants}
                custom={index}
                whileHover="hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div 
                  className="mb-4"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <benefit.icon className={`w-12 h-12 ${benefit.color}`} />
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                >
                  {benefit.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  viewport={{ once: true }}
                >
                  {benefit.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Statistics Section with Animated Counters */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-blue-600">
                <AnimatedCounter end={2500} suffix="+" />
              </div>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1 }}
                viewport={{ once: true }}
              >
                Tech Professionals
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-blue-600">
                <AnimatedCounter end={350} suffix="+" />
              </div>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                viewport={{ once: true }}
              >
                Global Companies
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-green-600">
                <AnimatedCounter end={15} suffix="+" />
              </div>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                viewport={{ once: true }}
              >
                Countries
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-amber-600">
                <AnimatedCounter end={85} suffix="%" />
              </div>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                viewport={{ once: true }}
              >
                Placement Rate
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action with Dynamic Effects */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-center" />
        </motion.div>

        <motion.div 
          className="max-w-6xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="text-xl max-w-3xl mx-auto mb-10 text-blue-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {activeTab === "jobseekers"
              ? "Take the first step toward your international tech career. Browse jobs with visa sponsorship today."
              : "Connect with exceptional African tech talent ready to contribute to your global team."}
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -1, 1, 0],
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2 relative overflow-hidden group">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                />
                <span className="relative z-10">{activeContent.cta.text}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </motion.div>
              </button>
            </motion.div>
            
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotate: [0, 1, -1, 0],
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg relative overflow-hidden group">
                <motion.span
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                />
                <span className="relative z-10">Contact Us</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Success Stories with Enhanced Animation */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="mb-4 px-3 py-1 bg-blue-100 text-blue-800 border-blue-200 rounded-full inline-block"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
            >
              Success Stories
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {activeTab === "jobseekers" 
                ? "African Developers Going Global"
                : "Companies Finding Exceptional Talent"}
            </motion.h2>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* First Testimonial */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 relative cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className="absolute -top-5 -left-5 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ rotate: 360 }}
              >
                <span className="text-blue-600 text-2xl">"</span>
              </motion.div>
              
              <motion.div 
                className="mb-6 pt-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-600 italic">
                  {activeTab === "jobseekers" 
                    ? "VizzarJobs changed my life. I went from working locally in Lagos to joining a tech company in Amsterdam. The visa sponsorship process was seamless thanks to their guidance."
                    : "Finding developers with the right skills who were also interested in relocation was always a challenge. VizzarJobs solved this by connecting us with pre-vetted candidates eager for international opportunities."}
                </p>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "jobseekers" ? "OP" : "JR"}
                </motion.div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {activeTab === "jobseekers" ? "Oluwaseun P." : "Jessica R."}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeTab === "jobseekers" ? "Backend Developer, Amsterdam" : "CTO, TechNova Solutions"}
                  </p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Second Testimonial */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 relative cursor-pointer"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                rotateY: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className="absolute -top-5 -left-5 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                whileHover={{ rotate: 360 }}
              >
                <span className="text-blue-600 text-2xl">"</span>
              </motion.div>
              
              <motion.div 
                className="mb-6 pt-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-600 italic">
                  {activeTab === "jobseekers" 
                    ? "After years of trying to find visa-sponsored roles, I found three opportunities within my first week on VizzarJobs. Now I'm working as a Senior React Developer in Berlin."
                    : "The quality of candidates we've hired through VizzarJobs has been exceptional. They bring unique perspectives and skills that have strengthened our engineering team considerably."}
                </p>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "jobseekers" ? "KM" : "MS"}
                </motion.div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {activeTab === "jobseekers" ? "Kwame M." : "Michael S."}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeTab === "jobseekers" ? "Frontend Developer, Berlin" : "Head of Engineering, DataFlow Inc."}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section with Accordion-style Animation */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="mb-4 px-3 py-1 bg-amber-100 text-amber-800 border-amber-200 rounded-full inline-block"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Common Questions
            </motion.h2>
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                question: activeTab === "jobseekers" 
                  ? "Do I need to pay to apply for jobs?"
                  : "How do you verify tech talent?",
                answer: activeTab === "jobseekers" 
                  ? "No, VizzarJobs is completely free for job seekers. We make our revenue from employers who post job listings."
                  : "We have a rigorous verification process that includes technical assessments, credential verification, and interviews to ensure the quality of candidates on our platform."
              },
              {
                question: activeTab === "jobseekers" 
                  ? "What kind of support do you offer for visa applications?"
                  : "What is the typical hiring timeline?",
                answer: activeTab === "jobseekers" 
                  ? "While we don't directly process visas, we provide resources, checklists, and connect you with employers who have established visa sponsorship processes."
                  : "The timeline varies, but most companies find and hire candidates within 4-6 weeks. Visa processing typically takes an additional 4-12 weeks depending on the country."
              },
              {
                question: activeTab === "jobseekers" 
                  ? "Which countries do you have job opportunities in?"
                  : "What costs are involved in hiring through VizzarJobs?",
                answer: activeTab === "jobseekers" 
                  ? "We feature opportunities primarily in the US, UK, Canada, Germany, Netherlands, Australia, and other tech hubs that offer visa sponsorship."
                  : "We have transparent pricing based on the number of roles you post. There are no hidden fees, and we don't charge placement fees like traditional recruiting agencies."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div 
                  className="flex items-center gap-3 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <QuestionCircle />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </motion.div>
                <motion.p 
                  className="text-gray-600 ml-8"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  viewport={{ once: true }}
                >
                  {faq.answer}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}