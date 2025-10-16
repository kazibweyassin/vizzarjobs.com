"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Globe, 
  Users, 
  Award, 
  Target, 
  CheckCircle, 
  Briefcase,
  Building2,
  ShieldCheck,
  Handshake,
  MapPin,
  TrendingUp,
  Heart,
  Zap,
  Star,
  ArrowRight,
  Play,
  Linkedin,
  Twitter,
  Mail,
  Sparkles,
  Rocket,
  ChevronRight,
  Quote
} from "lucide-react";

export default function AboutUsPage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  const [activeValue, setActiveValue] = useState(0);
  const [counter, setCounter] = useState({ countries: 0, jobs: 0, professionals: 0, companies: 0 });

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targets = { countries: 30, jobs: 1000, professionals: 5000, companies: 200 };
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      setCounter({
        countries: Math.floor((targets.countries / steps) * step),
        jobs: Math.floor((targets.jobs / steps) * step),
        professionals: Math.floor((targets.professionals / steps) * step),
        companies: Math.floor((targets.companies / steps) * step)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  // Rotate active value
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.7,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
      transition: { 
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Enhanced team members
  const teamMembers = [
    {
      name: "Yassin Kazibwe",
      role: "Founder & CEO",
      bio: "Former software engineer with experience at global tech companies. Passionate about connecting African talent with world-class opportunities.",
      image: "/images/about/ceo.jpg",
      location: "Cape Town, South Africa",
      social: { linkedin: "#", twitter: "#", email: "yassin@vizzarjobs.com" },
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      name: "Amara Nwosu",
      role: "Chief Operating Officer",
      bio: "15+ years experience in tech recruitment and operations. Specializes in cross-border hiring and talent mobility.",
      image: "/images/about/coo.jpg",
      location: "Lagos, Nigeria",
      social: { linkedin: "#", twitter: "#", email: "amara@vizzarjobs.com" },
      gradient: "from-blue-600 to-blue-700"
    },
    {
      name: "Daniel Ochieng",
      role: "Chief Technology Officer",
      bio: "Experienced tech leader with background in building scalable platforms. Previously led engineering teams at multinational companies.",
      image: "/images/about/cto.jpg",
      location: "Nairobi, Kenya",
      social: { linkedin: "#", twitter: "#", email: "daniel@vizzarjobs.com" },
      gradient: "from-green-600 to-teal-600"
    },
    {
      name: "Fatima Mohammed",
      role: "Head of Talent Relations",
      bio: "Expert in career development and international recruitment. Passionate about helping professionals navigate global career transitions.",
      image: "/images/about/hr.jpg",
      location: "Accra, Ghana",
      social: { linkedin: "#", twitter: "#", email: "fatima@vizzarjobs.com" },
      gradient: "from-orange-600 to-red-600"
    }
  ];

  // Enhanced values
  const values = [
    {
      icon: Globe,
      title: "Global Opportunity",
      description: "We believe talented professionals should have access to global opportunities regardless of their location or background.",
      gradient: "from-blue-600 to-cyan-600",
      bgGradient: "from-blue-50 via-cyan-50 to-blue-100",
      iconBg: "bg-blue-500/10"
    },
    {
      icon: ShieldCheck,
      title: "Trust & Transparency",
      description: "We rigorously verify all employers and job listings to ensure they provide legitimate visa sponsorship and fair compensation.",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 via-blue-50 to-blue-100",
      iconBg: "bg-blue-500/10"
    },
    {
      icon: Heart,
      title: "Mutual Success",
      description: "We're committed to creating value for both job seekers and employers through meaningful, long-term connections.",
      gradient: "from-rose-600 to-orange-600",
      bgGradient: "from-rose-50 via-orange-50 to-rose-100",
      iconBg: "bg-rose-500/10"
    },
    {
      icon: Zap,
      title: "Innovation Excellence",
      description: "We maintain high standards in our platform, processes, and the opportunities we showcase to our community.",
      gradient: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 via-teal-50 to-emerald-100",
      iconBg: "bg-emerald-500/10"
    }
  ];

  // Enhanced milestones
  const milestones = [
    {
      year: "2023",
      title: "Foundation & Vision",
      description: "VizzarJobs was founded in Cape Town with a mission to connect African tech talent with global opportunities.",
      icon: Target,
      color: "blue",
      achievement: "Platform Conceptualized"
    },
    {
      year: "2024",
      title: "Platform Launch",
      description: "Official launch of the VizzarJobs platform, connecting candidates with employers across three continents.",
      icon: Rocket,
      color: "blue",
      achievement: "1,000+ Jobs Listed"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to serve professionals across all African countries with opportunities in over 20 destination countries.",
      icon: Globe,
      color: "teal",
      achievement: "30+ Countries Reached"
    },
    {
      year: "2025",
      title: "Elite Network Launch",
      description: "Launched the VizzarJobs Elite network, providing premium services and exclusive opportunities for top talent.",
      icon: Star,
      color: "orange",
      achievement: "Premium Tier Activated"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "VizzarJobs transformed my career. Within 3 months, I secured a senior developer role in Berlin with full visa sponsorship.",
      author: "Michael Adekunle",
      role: "Software Engineer",
      location: "Lagos → Berlin",
      avatar: "/images/testimonials/1.jpg"
    },
    {
      quote: "The platform's verification process gave me confidence. Every opportunity was legitimate and matched my qualifications perfectly.",
      author: "Sarah Omondi",
      role: "Data Scientist",
      location: "Nairobi → Toronto",
      avatar: "/images/testimonials/2.jpg"
    },
    {
      quote: "As an employer, VizzarJobs connected us with exceptional talent we wouldn't have found otherwise. Highly recommended!",
      author: "James Peterson",
      role: "CTO, TechCorp",
      location: "London, UK",
      avatar: "/images/testimonials/3.jpg"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 min-h-screen overflow-hidden">
      {/* Ultra-Enhanced Hero Section */}
      <div className="pt-24 pb-32 relative bg-gradient-to-br from-slate-900 via-blue-900 to-blue-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: 'center'
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        ></motion.div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            style={{ opacity, scale }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold mb-8 shadow-2xl hover:bg-white/15 transition-all"
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <span>Connecting talent across continents</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              About{" "}
              <motion.span 
                className="bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent inline-block"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                VizzarJobs
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Empowering <span className="text-white font-semibold">elite African professionals</span> with 
              <span className="text-cyan-300 font-semibold"> premium global opportunities</span> through 
              <span className="text-blue-300 font-semibold"> visa sponsorship</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <Link 
                href="/jobs"
                className="group inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-base font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Explore Opportunities
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <button className="group inline-flex items-center px-8 py-4 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white text-base font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Our Story
              </button>
          </motion.div>

            {/* Animated Stats Preview */}
          <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { value: `${counter.countries}+`, label: "Countries", icon: Globe },
                { value: `${counter.jobs}+`, label: "Jobs", icon: Briefcase },
                { value: `${counter.professionals}+`, label: "Professionals", icon: Users },
                { value: `${counter.companies}+`, label: "Companies", icon: Building2 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
                  whileHover={{ y: -5, scale: 1.05 }}
                  animate={activeValue === index ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-8 h-8 text-cyan-300 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision - Enhanced with parallax */}
      <div className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {[
              { title: "Our Mission", icon: Target, image: "/images/about/mission.jpg", desc: "To bridge the opportunity gap by connecting talented African professionals with global employers offering visa sponsorship, enabling career growth and knowledge exchange across borders.", gradient: "from-blue-600 to-cyan-600" },
              { title: "Our Vision", icon: Globe, image: "/images/about/vision.jpg", desc: "To create a world where geography is no longer a barrier to opportunity, enabling the free flow of talent and ideas across borders while empowering professionals to build global careers.", gradient: "from-blue-600 to-blue-700" }
            ].map((item, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                      <Image 
                      src={item.image} 
                      alt={item.title} 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                        fill
                      />
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
            <motion.div
                      className="absolute top-6 left-6 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    </div>
                  <div className="p-8">
                    <h2 className={`text-3xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-4`}>
                      {item.title}
                  </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story - Enhanced */}
      <div className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
              animate={floatingAnimation}
            >
              <Heart className="w-4 h-4 mr-2" />
              Our Journey
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Story
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                { title: "The Challenge", content: "We observed an abundance of talented professionals across Africa seeking global opportunities, and growing companies worldwide looking to diversify through international hiring.", gradient: "from-blue-600/20 to-cyan-600/20", border: "border-blue-400/30" },
                { title: "The Solution", content: "Founded in 2023 in Cape Town, we built a platform specifically addressing visa sponsorship challenges, creating a trusted bridge between African talent and global employers.", gradient: "from-blue-600/20 to-blue-700/20", border: "border-blue-400/30" }
              ].map((item, index) => (
            <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`bg-gradient-to-br ${item.gradient} backdrop-blur-xl rounded-2xl p-8 border ${item.border}`}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{item.content}</p>
                </motion.div>
              ))}
                </div>

            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-white mb-6">Today & Beyond</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                      VizzarJobs has evolved into a comprehensive platform that connects talent with opportunities and provides resources, guidance, and community support throughout the international job search journey.
                    </p>
              <p className="text-blue-100 text-lg leading-relaxed">
                      Our commitment remains unwavering: empowering professionals to build global careers while helping companies access diverse talent pools, creating mutual value and lasting success.
                    </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values - Ultra Enhanced */}
      <div className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 text-sm font-medium mb-6"
              animate={floatingAnimation}
            >
              <Zap className="w-4 h-4 mr-2" />
              Our Foundation
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              Our Values
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-600 mx-auto rounded-full mb-8"></div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group relative"
              >
                <div className={`bg-gradient-to-br ${value.bgGradient} rounded-3xl p-8 border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden`}>
                  {/* Animated background blob */}
                  <motion.div 
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.gradient} rounded-full opacity-20 blur-2xl`}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg relative z-10`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <value.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Team Section - Ultra Enhanced */}
      <div className="py-32 bg-gradient-to-br from-slate-50 to-blue-100 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 text-sm font-medium mb-6"
              animate={floatingAnimation}
            >
              <Users className="w-4 h-4 mr-2" />
              Meet the Team
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              The People Behind VizzarJobs
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -15 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-square overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    fill
                  />
                    <div className={`absolute inset-0 bg-gradient-to-t ${member.gradient} opacity-0 group-hover:opacity-70 transition-opacity duration-500`}></div>
                    
                    {/* Social icons overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex gap-3">
                        <motion.a 
                          href={member.social.linkedin}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 border border-white/30"
                        >
                          <Linkedin className="w-5 h-5" />
                        </motion.a>
                        <motion.a 
                          href={member.social.twitter}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 border border-white/30"
                        >
                          <Twitter className="w-5 h-5" />
                        </motion.a>
                        <motion.a 
                          href={`mailto:${member.social.email}`}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 border border-white/30"
                        >
                          <Mail className="w-5 h-5" />
                        </motion.a>
                    </div>
                  </div>
                </div>
                  
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className={`bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent font-semibold mb-3`}>{member.role}</p>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    {member.location}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Milestones - Enhanced Timeline */}
      <div className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 text-sm font-medium mb-6"
              animate={floatingAnimation}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Our Progress
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              Our Journey
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className="flex items-stretch mb-20 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                {/* Timeline indicator */}
                <div className="w-40 flex-shrink-0 flex flex-col items-center">
                  <motion.div 
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${milestone.color}-500 to-${milestone.color}-600 flex items-center justify-center shadow-xl relative z-10`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <milestone.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  {index < milestones.length - 1 && (
                    <motion.div 
                      className={`w-1 flex-grow bg-gradient-to-b from-${milestone.color}-500 to-${milestone.color}-600 my-4 rounded-full relative`}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      viewport={{ once: true }}
                      style={{ transformOrigin: 'top' }}
                    >
                      {/* Animated dots along the line */}
                      <motion.div
                        className="absolute w-2 h-2 bg-white rounded-full left-1/2 -translate-x-1/2"
                        animate={{ y: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  )}
                </div>
                
                {/* Content card */}
                <motion.div 
                  className="flex-grow mb-4 ml-8 group"
                  whileHover={{ x: 10 }}
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100 relative overflow-hidden hover:shadow-2xl transition-all duration-500">
                    {/* Animated background */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-${milestone.color}-500/10 to-transparent rounded-full transform translate-x-32 -translate-y-32 group-hover:scale-150 transition-transform duration-700`}></div>
                    
                  <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <motion.div 
                          className={`px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-${milestone.color}-500 to-${milestone.color}-600 text-white shadow-lg`}
                          whileHover={{ scale: 1.05 }}
                        >
                      {milestone.year}
                        </motion.div>
                        <div className={`px-4 py-2 rounded-full text-xs font-semibold bg-${milestone.color}-100 text-${milestone.color}-700`}>
                          {milestone.achievement}
                    </div>
                      </div>
                      
                      <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {milestone.title}
                    </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{milestone.description}</p>
                  </div>
                </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section - New Addition */}
      <div className="py-32 bg-gradient-to-br from-blue-900 via-blue-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
              animate={floatingAnimation}
            >
              <Quote className="w-4 h-4 mr-2" />
              Success Stories
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              What Our Community Says
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                
                <Quote className="w-12 h-12 text-cyan-300/50 mb-6" />
                <p className="text-white text-lg leading-relaxed mb-6 relative z-10">{testimonial.quote}</p>
                
                <div className="flex items-center relative z-10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold">{testimonial.author}</div>
                    <div className="text-cyan-300 text-sm">{testimonial.role}</div>
                    <div className="text-blue-200 text-xs mt-1">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="py-32 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 text-sm font-medium mb-6"
              animate={floatingAnimation}
            >
              <Award className="w-4 h-4 mr-2" />
              Our Impact
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              Numbers That Matter
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, number: `${counter.countries}+`, label: "Countries Reached", gradient: "from-blue-600 to-cyan-600", bg: "from-blue-50 to-cyan-50" },
              { icon: Briefcase, number: `${counter.jobs}+`, label: "Job Opportunities", gradient: "from-blue-600 to-blue-700", bg: "from-blue-50 to-blue-50" },
              { icon: Users, number: `${counter.professionals}+`, label: "Registered Professionals", gradient: "from-green-600 to-teal-600", bg: "from-green-50 to-teal-50" },
              { icon: Building2, number: `${counter.companies}+`, label: "Hiring Companies", gradient: "from-orange-600 to-red-600", bg: "from-orange-50 to-red-50" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.05 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${stat.bg} rounded-3xl p-8 text-center relative overflow-hidden border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-500`}>
                  <motion.div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 transform translate-x-16 -translate-y-16 bg-gradient-to-br"
                    animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  ></motion.div>
                  
                  <motion.div 
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-r ${stat.gradient}`}
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <div className={`text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-semibold text-lg">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Ultra-Enhanced CTA Section */}
      <div className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/about/cta-background.jpg" 
            alt="Global professionals" 
            className="object-cover mix-blend-overlay opacity-20"
            fill
          />
        </div>
        
        {/* Animated background elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.7, 0.3],
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
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold mb-8"
            >
              <Handshake className="w-5 h-5" />
              Ready to start your global career journey?
            </motion.div>

            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Join Us in Shaping the 
              <motion.span 
                className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-blue-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Future of Global Careers
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Whether you're seeking opportunities abroad or looking to hire diverse talent, 
              VizzarJobs is your trusted partner for success.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/jobs" 
                  className="group inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
              >
                  <Briefcase className="w-6 h-6 mr-3" />
                Find Opportunities
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/post-job" 
                  className="group inline-flex items-center justify-center px-10 py-5 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white text-lg font-bold hover:bg-white/20 transition-all duration-300"
              >
                  <Building2 className="w-6 h-6 mr-3" />
                Post Jobs
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-12 border-t border-white/20"
            >
              <p className="text-blue-200 mb-6 text-lg">Join thousands of professionals already on their journey</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="text-white/60 text-sm font-medium">Trusted by professionals from</div>
                <motion.div 
                  className="flex gap-6 text-white/80 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {['🇳🇬 Nigeria', '🇿🇦 South Africa', '🇰🇪 Kenya', '🇬🇭 Ghana', '🇺🇬 Uganda'].map((country, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.2, y: -5 }}
                      className="cursor-default"
                    >
                      {country}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


