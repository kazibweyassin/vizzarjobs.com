"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  
  const [counter, setCounter] = useState({ countries: 0, jobs: 0, professionals: 0, companies: 0 });
  const [activeValue, setActiveValue] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  const teamMembers = [
    {
      name: "Yassin Kazibwe",
      role: "Founder & CEO",
      bio: "Former software engineer with experience at global tech companies. Passionate about connecting African talent with world-class opportunities.",
      location: "Cape Town, South Africa",
      social: { linkedin: "#", twitter: "#", email: "yassin@vizzarjobs.com" }
    },
    {
      name: "Amara Nwosu",
      role: "Chief Operating Officer",
      bio: "15+ years experience in tech recruitment and operations. Specializes in cross-border hiring and talent mobility.",
      location: "Lagos, Nigeria",
      social: { linkedin: "#", twitter: "#", email: "amara@vizzarjobs.com" }
    },
    {
      name: "Daniel Ochieng",
      role: "Chief Technology Officer",
      bio: "Experienced tech leader with background in building scalable platforms. Previously led engineering teams at multinational companies.",
      location: "Nairobi, Kenya",
      social: { linkedin: "#", twitter: "#", email: "daniel@vizzarjobs.com" }
    },
    {
      name: "Fatima Mohammed",
      role: "Head of Talent Relations",
      bio: "Expert in career development and international recruitment. Passionate about helping professionals navigate global career transitions.",
      location: "Accra, Ghana",
      social: { linkedin: "#", twitter: "#", email: "fatima@vizzarjobs.com" }
    }
  ];

  const values = [
    {
      icon: Globe,
      title: "AI/ML Excellence",
      description: "We specialize in connecting top AI/ML talent with leading Canadian companies, focusing on cutting-edge technology roles.",
      color: "bg-blue-50"
    },
    {
      icon: ShieldCheck,
      title: "Canada-Focused",
      description: "We ensure all opportunities provide legitimate Canadian visa sponsorship and competitive compensation packages.",
      color: "bg-slate-50"
    },
    {
      icon: Heart,
      title: "Talent Success",
      description: "We're committed to helping AI/ML professionals build successful careers in Canada's thriving tech ecosystem.",
      color: "bg-amber-50"
    },
    {
      icon: Zap,
      title: "Innovation First",
      description: "We maintain high standards in showcasing only the most innovative AI/ML opportunities and companies.",
      color: "bg-green-50"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Foundation & Vision",
      description: "VizzarJobs was founded in Cape Town with a mission to connect African tech talent with global opportunities.",
      icon: Target,
      achievement: "Platform Conceptualized"
    },
    {
      year: "2024",
      title: "Platform Launch",
      description: "Official launch of the VizzarJobs platform, connecting candidates with employers across three continents.",
      icon: Rocket,
      achievement: "1,000+ Jobs Listed"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to serve professionals across all African countries with opportunities in over 20 destination countries.",
      icon: Globe,
      achievement: "30+ Countries Reached"
    },
    {
      year: "2025",
      title: "Elite Network Launch",
      description: "Launched the VizzarJobs Elite network, providing premium services and exclusive opportunities for top talent.",
      icon: Star,
      achievement: "Premium Tier Activated"
    }
  ];

  const testimonials = [
    {
      quote: "VizzarJobs transformed my career. Within 3 months, I secured a senior developer role in Berlin with full visa sponsorship.",
      author: "Michael Adekunle",
      role: "Software Engineer",
      location: "Lagos → Berlin"
    },
    {
      quote: "The platform's verification process gave me confidence. Every opportunity was legitimate and matched my qualifications perfectly.",
      author: "Sarah Omondi",
      role: "Data Scientist",
      location: "Nairobi → Toronto"
    },
    {
      quote: "As an employer, VizzarJobs connected us with exceptional talent we wouldn't have found otherwise. Highly recommended!",
      author: "James Peterson",
      role: "CTO, TechCorp",
      location: "London, UK"
    }
  ];

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="pt-32 pb-24 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 border-t border-slate-700/20"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            style={{ opacity, scale }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-600 bg-slate-800 text-slate-300 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Connecting AI/ML talent to Canada</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              About VizzarJobs
            </motion.h1>
            
            <motion.p 
              className="text-xl text-slate-300 mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Empowering AI/ML professionals with premium opportunities in Canada through visa sponsorship
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { value: `${counter.countries}+`, label: "Countries", icon: Globe },
                { value: `${counter.jobs}+`, label: "Jobs", icon: Briefcase },
                { value: `${counter.professionals}+`, label: "Professionals", icon: Users },
                { value: `${counter.companies}+`, label: "Companies", icon: Building2 }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {[
              { 
                title: "Our Mission", 
                icon: Target, 
                desc: "To connect exceptional AI/ML talent with leading Canadian companies, enabling professionals to build successful careers in Canada's thriving tech ecosystem through visa sponsorship." 
              },
              { 
                title: "Our Vision", 
                icon: Globe, 
                desc: "To become the premier platform for AI/ML talent placement in Canada, fostering innovation and excellence in artificial intelligence and machine learning careers." 
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">{item.title}</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Story</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {[
                { 
                  title: "The Challenge", 
                  content: "We observed an abundance of talented professionals across Africa seeking global opportunities, and growing companies worldwide looking to diversify through international hiring." 
                },
                { 
                  title: "The Solution", 
                  content: "Founded in 2023 in Cape Town, we built a platform specifically addressing visa sponsorship challenges, creating a trusted bridge between African talent and global employers." 
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.content}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Today & Beyond</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                VizzarJobs has evolved into a comprehensive platform that connects talent with opportunities and provides resources, guidance, and community support throughout the international job search journey.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our commitment remains unwavering: empowering professionals to build global careers while helping companies access diverse talent pools, creating mutual value and lasting success.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className={`${value.color} rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Team */}
      <div className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The Team Behind VizzarJobs</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-slate-200 flex items-center justify-center">
                    <div className="text-5xl font-bold text-slate-300">{member.name.charAt(0)}</div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-semibold text-sm mb-3">{member.role}</p>
                    <div className="flex items-center text-slate-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      {member.location}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                    
                    <div className="flex gap-2">
                      <a href={member.social.linkedin} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-blue-100 transition">
                        <Linkedin className="w-4 h-4 text-slate-600 hover:text-blue-600" />
                      </a>
                      <a href={member.social.twitter} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-blue-100 transition">
                        <Twitter className="w-4 h-4 text-slate-600 hover:text-blue-600" />
                      </a>
                      <a href={`mailto:${member.social.email}`} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-blue-100 transition">
                        <Mail className="w-4 h-4 text-slate-600 hover:text-blue-600" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Journey</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div 
                  key={index}
                  className="flex gap-8 mb-12 last:mb-0"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center shadow-sm">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-1 h-16 bg-blue-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="pt-2 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                        {milestone.year}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        {milestone.achievement}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{milestone.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Success Stories</h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full"></div>
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
                whileHover={{ y: -8 }}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <Quote className="w-8 h-8 text-blue-400 mb-4" />
                <p className="text-white text-lg leading-relaxed mb-6">{testimonial.quote}</p>
                
                <div>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mb-3">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-blue-400 text-sm">{testimonial.role}</div>
                  <div className="text-slate-400 text-xs mt-1">{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-slate-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to start your global career journey?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-slate-600 mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Whether you're seeking opportunities abroad or looking to hire diverse talent, VizzarJobs is your trusted partner for success.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <a href="/jobs" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5" />
                Find Opportunities
              </a>
              <a href="/post-job" className="px-8 py-3 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" />
                Post Jobs
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}