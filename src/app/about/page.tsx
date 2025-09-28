"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Mail
} from "lucide-react";

export default function AboutUsPage() {
  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Enhanced team members with social links
  const teamMembers = [
    {
      name: "Yassin Kazibwe",
      role: "Founder & CEO",
      bio: "Former software engineer with experience at global tech companies. Passionate about connecting African talent with world-class opportunities.",
      // image: "/images/about/ceo.jpg",
      location: "Cape Town, South Africa",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "yassin@vizzarjobs.com"
      }
    },
    {
      name: "Amara Nwosu",
      role: "Chief Operating Officer",
      bio: "15+ years experience in tech recruitment and operations. Specializes in cross-border hiring and talent mobility.",
      // image: "/images/about/coo.jpg",
      location: "Lagos, Nigeria",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "amara@vizzarjobs.com"
      }
    },
    {
      name: "Daniel Ochieng",
      role: "Chief Technology Officer",
      bio: "Experienced tech leader with background in building scalable platforms. Previously led engineering teams at multinational companies.",
      // image: "/images/about/cto.jpg",
      location: "Nairobi, Kenya",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "daniel@vizzarjobs.com"
      }
    },
    {
      name: "Fatima Mohammed",
      role: "Head of Talent Relations",
      bio: "Expert in career development and international recruitment. Passionate about helping professionals navigate global career transitions.",
      // image: "/images/about/hr.jpg",
      location: "Accra, Ghana",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "fatima@vizzarjobs.com"
      }
    }
  ];

  // Enhanced values with gradients
  const values = [
    {
      icon: Globe,
      title: "Global Opportunity",
      description: "We believe talented professionals should have access to global opportunities regardless of their location or background.",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: ShieldCheck,
      title: "Trust & Transparency",
      description: "We rigorously verify all employers and job listings to ensure they provide legitimate visa sponsorship and fair compensation.",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: Heart,
      title: "Mutual Success",
      description: "We're committed to creating value for both job seekers and employers through meaningful, long-term connections.",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: Zap,
      title: "Innovation Excellence",
      description: "We maintain high standards in our platform, processes, and the opportunities we showcase to our community.",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100"
    }
  ];

  // Enhanced milestones with more visual appeal
  const milestones = [
    {
      year: "2023",
      title: "Foundation & Vision",
      description: "VizzarJobs was founded in Cape Town with a mission to connect African tech talent with global opportunities.",
      icon: Target,
      color: "blue"
    },
    {
      year: "2024",
      title: "Platform Launch",
      description: "Official launch of the VizzarJobs platform, connecting candidates with employers across three continents.",
      icon: Globe,
      color: "blue"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to serve professionals across all African countries with opportunities in over 20 destination countries.",
      icon: TrendingUp,
      color: "blue"
    },
    {
      year: "2025",
      title: "Elite Network Launch",
      description: "Launched the VizzarJobs Elite network, providing premium services and exclusive opportunities for top talent.",
      icon: Star,
      color: "blue"
    }
  ];

  // Enhanced stats with icons
  const stats = [
    { 
      number: "30+", 
      label: "Countries Reached", 
      icon: Globe,
      color: "blue" 
    },
    { 
      number: "1,000+", 
      label: "Job Opportunities", 
      icon: Briefcase,
      color: "blue" 
    },
    { 
      number: "5,000+", 
      label: "Registered Professionals", 
      icon: Users,
      color: "blue" 
    },
    { 
      number: "200+", 
      label: "Hiring Companies", 
      icon: Building2,
      color: "blue" 
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <div className="pt-20 pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 mr-2" />
              Connecting talent across continents
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
              About VizzarJobs
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              Empowering <span className="text-blue-600 font-semibold">elite African professionals</span> with 
              <span className="text-blue-700 font-semibold"> premium global opportunities</span> through visa sponsorship
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <Link 
                href="/jobs"
                className="group inline-flex items-center px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Explore Opportunities
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group inline-flex items-center px-6 py-2 rounded-md border border-gray-300 bg-background text-gray-700 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                <Play className="w-5 h-5 mr-2" />
                Watch Our Story
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-blue-700/20 z-10" />
              <Image 
                src="/images/about/hero.jpg" 
                alt="VizzarJobs team collaborating" 
                className="object-cover"
                fill
                priority
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 z-20">
                <p className="text-gray-800 font-medium">
                  "Building bridges between African talent and global opportunities"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mix-blend-multiply opacity-20 filter blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mix-blend-multiply opacity-20 filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-gradient-to-br from-blue-700 to-blue-800 mix-blend-multiply opacity-20 filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* Enhanced Mission and Vision Section */}
      <div className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-10 border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full opacity-10 transform translate-x-16 -translate-y-16" />
                <div className="relative z-10">
                  <div className="flex items-start mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                    <div className="w-32 h-32 rounded-lg overflow-hidden relative shadow-lg">
                      <Image 
                        src="/images/about/mission.jpg" 
                        alt="VizzarJobs mission" 
                        className="object-cover"
                        fill
                      />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
                    Our Mission
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To bridge the opportunity gap by connecting talented African professionals with global employers offering visa sponsorship, enabling career growth and knowledge exchange across borders.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-10 border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full opacity-10 transform translate-x-16 -translate-y-16" />
                <div className="relative z-10">
                  <div className="flex items-start mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                      <Globe className="w-10 h-10 text-white" />
                    </div>
                    <div className="w-32 h-32 rounded-lg overflow-hidden relative shadow-lg">
                      <Image 
                        src="/images/about/vision.jpg" 
                        alt="VizzarJobs vision" 
                        className="object-cover"
                        fill
                      />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
                    Our Vision
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To create a world where geography is no longer a barrier to opportunity, enabling the free flow of talent and ideas across borders while empowering professionals to build global careers.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Our Story Section */}
      <div className="py-20 md:py-32 bg-gradient-to-br from-white to-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              Our Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              Our Story
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-8 rounded-full"></div>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="grid md:grid-cols-2 gap-12 items-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We observed an abundance of talented professionals across Africa seeking global opportunities, and growing companies worldwide looking to diversify through international hiring.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">The Solution</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Founded in 2023 in Cape Town, we built a platform specifically addressing visa sponsorship challenges, creating a trusted bridge between African talent and global employers.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/images/about/story.jpg" 
                    alt="VizzarJobs story" 
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="text-3xl font-bold text-blue-600">2023</div>
                  <div className="text-gray-600">Founded</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32" />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6">Today & Beyond</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-lg leading-relaxed mb-4">
                      VizzarJobs has evolved into a comprehensive platform that connects talent with opportunities and provides resources, guidance, and community support throughout the international job search journey.
                    </p>
                  </div>
                  <div>
                    <p className="text-lg leading-relaxed">
                      Our commitment remains unwavering: empowering professionals to build global careers while helping companies access diverse talent pools, creating mutual value and lasting success.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Our Values Section */}
      <div className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Our Foundation
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              Our Values
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at VizzarJobs
            </p>
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
                className={`bg-gradient-to-br ${value.bgGradient} rounded-2xl shadow-lg p-8 border border-white/20 relative overflow-hidden group hover:shadow-xl transition-all duration-500`}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02
                }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Our Team Section */}
      <div className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Meet the Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              The People Behind VizzarJobs
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the passionate professionals dedicated to connecting talent across continents
            </p>
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-500"
                whileHover={{ y: -10 }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    fill
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex justify-center gap-3">
                      <a href={member.social.linkedin} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href={member.social.twitter} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href={`mailto:${member.social.email}`} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {member.location}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Milestones Section */}
      <div className="py-20 md:py-32 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Our Progress
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              Our Journey
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to connect talent across borders
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className="flex items-stretch mb-16 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-32 flex-shrink-0 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold shadow-lg">
                    <milestone.icon className="w-8 h-8" />
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-1 flex-grow bg-gradient-to-b from-blue-600 to-blue-700 my-4 rounded-full"></div>
                  )}
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 flex-grow mb-4 ml-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-16 -translate-y-16 bg-gradient-to-br from-blue-600 to-blue-700" />
                  <div className="relative z-10">
                    <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-blue-100 text-blue-800">
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Our Impact
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
              Numbers That Matter
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="relative rounded-2xl p-8 text-center group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 transform translate-x-10 -translate-y-10 bg-gradient-to-br from-current to-transparent group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-semibold">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-20 md:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/images/about/cta-background.jpg" 
            alt="Global professionals" 
            className="object-cover mix-blend-overlay opacity-40"
            fill
            priority={false}
          />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8"
            >
              <Handshake className="w-4 h-4 mr-2" />
              Ready to start your global career journey?
            </motion.div>

            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join Us in Shaping the 
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Future of Global Careers
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Whether you're seeking opportunities abroad or looking to hire diverse talent, 
              VizzarJobs is your trusted partner for success.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link 
                href="/jobs" 
                className="group inline-flex items-center justify-center px-6 py-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 text-sm font-medium shadow-lg transition-colors"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Find Opportunities
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/post-job" 
                className="group inline-flex items-center justify-center px-6 py-2 rounded-md border border-white text-white hover:bg-white hover:text-blue-600 text-sm font-medium transition-colors"
              >
                <Building2 className="w-6 h-6 mr-2" />
                Post Jobs
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-16 pt-12 border-t border-white/20"
            >
              <p className="text-blue-200 mb-6">Join thousands of professionals already on their journey</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-white/80 text-sm">Trusted by professionals from</div>
                <div className="flex gap-6 text-white/60">
                  <span>🇳🇬 Nigeria</span>
                  <span>🇿🇦 South Africa</span>
                  <span>🇰🇪 Kenya</span>
                  <span>🇬🇭 Ghana</span>
                  <span>🇪🇬 Uganda</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
