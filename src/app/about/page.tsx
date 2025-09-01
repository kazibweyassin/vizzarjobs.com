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
  Handshake
} from "lucide-react";

export default function AboutUsPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
      }
    }
  };

  // Team members data
  const teamMembers = [
    {
      name: "Yassin Kazibwe",
      role: "Founder & CEO",
      bio: "Former software engineer with experience at global tech companies. Passionate about connecting African talent with world-class opportunities.",
      image: "/images/about/ceo.jpg"
    },
    {
      name: "Amara Nwosu",
      role: "Chief Operating Officer",
      bio: "15+ years experience in tech recruitment and operations. Specializes in cross-border hiring and talent mobility.",
      image: "/images/about/coo.jpg"
    },
    {
      name: "Daniel Ochieng",
      role: "Chief Technology Officer",
      bio: "Experienced tech leader with background in building scalable platforms. Previously led engineering teams at multinational companies.",
      image: "/images/about/cto.jpg"
    },
    {
      name: "Fatima Mohammed",
      role: "Head of Talent Relations",
      bio: "Expert in career development and international recruitment. Passionate about helping professionals navigate global career transitions.",
      image: "/images/about/hr.jpg"
    }
  ];

  // Company values data
  const values = [
    {
      icon: Globe,
      title: "Global Opportunity",
      description: "We believe talented professionals should have access to global opportunities regardless of their location or background."
    },
    {
      icon: ShieldCheck,
      title: "Trust & Transparency",
      description: "We rigorously verify all employers and job listings to ensure they provide legitimate visa sponsorship and fair compensation."
    },
    {
      icon: Handshake,
      title: "Mutual Success",
      description: "We're committed to creating value for both job seekers and employers through meaningful, long-term connections."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We maintain high standards in our platform, processes, and the opportunities we showcase to our community."
    }
  ];

  // Milestones data
  const milestones = [
    {
      year: "2023",
      title: "Foundation",
      description: "VizzarJobs was founded in Cape Town with a mission to connect African tech talent with global opportunities."
    },
    {
      year: "2024",
      title: "Platform Launch",
      description: "Official launch of the VizzarJobs platform, connecting candidates with employers across three continents."
    },
    {
      year: "2025",
      title: "Growth & Expansion",
      description: "Expanded to serve professionals across all African countries with opportunities in over 20 destination countries."
    },
    {
      year: "2025",
      title: "Talent Network",
      description: "Launched the VizzarJobs Elite network, providing premium services and exclusive opportunities for top talent."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-[#f8faff] to-[#f0f4ff] min-h-screen">
      {/* Hero section */}
      <div className="pt-20 pb-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About VizzarJobs
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Connecting elite African professionals with premium global opportunities through visa sponsorship
            </p>
          </motion.div>

          <motion.div
            className="max-w-5xl mx-auto mt-12 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="aspect-video relative rounded-xl overflow-hidden shadow-xl">
              <Image 
                src="/images/about/hero.jpg" 
                alt="VizzarJobs team collaborating" 
                className="object-cover"
                fill
                priority
              />
            </div>
          </motion.div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-blue-400 mix-blend-multiply opacity-10 filter blur-3xl" />
        <div className="absolute top-1/3 right-1/4 transform -translate-y-1/2 translate-x-1/2 w-80 h-80 rounded-full bg-purple-400 mix-blend-multiply opacity-10 filter blur-3xl" />
      </div>

      {/* Mission and Vision Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To bridge the opportunity gap by connecting talented African professionals with global employers offering visa sponsorship, enabling career growth and knowledge exchange across borders.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To create a world where geography is no longer a barrier to opportunity, enabling the free flow of talent and ideas across borders while empowering professionals to build global careers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="prose prose-lg prose-blue mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p>
                VizzarJobs was born from a simple observation: there's an abundance of talented professionals across Africa seeking global opportunities, and a growing number of companies worldwide looking to diversify their workforce through international hiring.
              </p>
              
              <p>
                Founded in 2023 in Cape Town, South Africa, our team experienced firsthand the challenges that African professionals face when seeking opportunities abroad—from finding legitimate visa-sponsoring employers to navigating complex relocation processes.
              </p>
              
              <p>
                We set out to build a platform that would specifically address these challenges, creating a trusted bridge between African talent and global employers. By focusing exclusively on positions that offer visa sponsorship, we've eliminated the most significant barrier to international mobility.
              </p>
              
              <p>
                Today, VizzarJobs has grown into a comprehensive platform that not only connects talent with opportunities but also provides resources, guidance, and community support throughout the entire international job search and relocation journey.
              </p>
              
              <p>
                Our commitment remains unwavering: to empower professionals to build global careers and help companies access diverse talent pools, creating value for both sides of the hiring equation.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
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
                className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 12px 24px -6px rgba(0, 0, 0, 0.1)" 
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate professionals behind VizzarJobs
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
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="aspect-square relative">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to connect talent across borders
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className="flex items-stretch mb-12 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="w-24 flex-shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-1 flex-grow bg-blue-200 my-2"></div>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 flex-grow mb-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "30+", label: "Countries Reached" },
              { number: "1,000+", label: "Job Opportunities" },
              { number: "5,000+", label: "Registered Professionals" },
              { number: "200+", label: "Hiring Companies" },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-white rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-white rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              Join Us in Shaping the Future of Global Careers
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Whether you're looking for opportunities abroad or seeking to hire diverse talent, VizzarJobs is here to help you succeed.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link 
                href="/jobs" 
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
              >
                Find Opportunities
              </Link>
              <Link 
                href="/post-job" 
                className="px-6 py-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 font-medium transition-colors"
              >
                Post Jobs
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
