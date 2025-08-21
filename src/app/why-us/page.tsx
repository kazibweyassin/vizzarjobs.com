"use client";

import { motion } from "framer-motion";
import { Award, Globe, ShieldCheck, Users, Briefcase, ArrowRight, Star, TrendingUp, Compass } from "lucide-react";
import Link from "next/link";

export default function WhyUsPage() {
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

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Vetted Opportunities",
      description: "Every job on VizzarJobs is pre-screened to ensure only legitimate visa-sponsoring positions are listed."
    },
    {
      icon: Globe,
      title: "Global Placement",
      description: "Access opportunities across North America, Europe, and the Middle East with full visa sponsorship support."
    },
    {
      icon: Users,
      title: "Talent Network",
      description: "Join a curated community of elite African professionals and connect with mentors in your field."
    },
    {
      icon: Briefcase,
      title: "Career Acceleration",
      description: "Our candidates typically see a 40-60% salary increase when placed through our platform."
    },
    {
      icon: Star,
      title: "Premium Employers",
      description: "Work with Fortune 500 companies and fast-growing startups that value diverse global talent."
    },
    {
      icon: TrendingUp,
      title: "Skills Development",
      description: "Access exclusive resources and training to prepare for global tech roles and interviews."
    }
  ];

  const testimonials = [
    {
      name: "David Ochieng",
      role: "Senior Software Engineer",
      company: "TechGlobal Inc.",
      location: "From Kenya to Canada",
      quote: "VizzarJobs changed my life. Within 3 weeks of applying, I had multiple interviews and secured a role that increased my salary by 3x. The visa process was smooth with their guidance."
    },
    {
      name: "Amina Ibrahim",
      role: "Product Manager",
      company: "InnovateX",
      location: "From Nigeria to Germany",
      quote: "After months of applying elsewhere without success, VizzarJobs connected me with a perfect role that matched my experience. The team supported me through every step of the relocation process."
    },
    {
      name: "Emmanuel Ndlovu",
      role: "Data Scientist",
      company: "AnalyticsPro",
      location: "From Zimbabwe to UK",
      quote: "The difference with VizzarJobs is their dedication to your success. They prepared me for interviews, negotiated my offer, and even helped with accommodation in my new country."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-20 pb-16">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 hidden lg:block">
          <div className="w-64 h-64 rounded-full opacity-10 bg-blue-600 blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 hidden lg:block">
          <div className="w-64 h-64 rounded-full opacity-10 bg-purple-600 blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.015] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-6">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                <Compass className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-sm font-medium text-gray-800">Your Career Journey • Our Mission</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">VizzarJobs</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're more than a job board—we're your partner in building a successful global career with the right opportunities and support every step of the way.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-base font-semibold text-blue-600">Our Advantage</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              The VizzarJobs Difference
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We've built a platform that addresses the unique challenges African professionals face when seeking global opportunities.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="relative p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-6">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              Our Impact in Numbers
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              We're proud of the opportunities we've created and the careers we've helped advance.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl font-extrabold text-white mb-2">500+</div>
              <div className="text-blue-200">Global Placements</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl font-extrabold text-white mb-2">94%</div>
              <div className="text-blue-200">Visa Success Rate</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-5xl font-extrabold text-white mb-2">25+</div>
              <div className="text-blue-200">Countries</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-5xl font-extrabold text-white mb-2">45%</div>
              <div className="text-blue-200">Average Salary Increase</div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-base font-semibold text-blue-600">Success Stories</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Hear From Our Professionals
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Read about the experiences of professionals who have successfully landed global roles through VizzarJobs.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute -top-3 left-8 text-6xl text-blue-100">"</div>
                <p className="text-gray-700 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.role} • {testimonial.company}</p>
                  <div className="text-blue-600 text-sm mt-1">{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Process Section */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-base font-semibold text-blue-600">How It Works</span>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Your Path to Global Opportunities
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We've simplified the process of finding and securing international roles with visa sponsorship.
            </p>
          </div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-blue-500 to-indigo-600" />
            
            {/* Process steps */}
            <div className="relative z-10 space-y-12 md:space-y-16">
              {/* Step 1 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex-1 md:text-right md:pr-12 mb-4 md:mb-0">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold md:ml-auto">1</div>
                  <h3 className="text-xl font-bold mt-3 text-gray-900">Create Your Profile</h3>
                  <p className="mt-2 text-gray-600 max-w-md md:ml-auto">
                    Build your professional profile highlighting your skills, experience, and career aspirations.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white shadow-md border-4 border-blue-600 flex items-center justify-center z-10">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 md:pl-12 md:text-left" />
              </motion.div>
              
              {/* Step 2 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex-1 md:text-right md:pr-12 mb-4 md:mb-0 md:order-2" />
                <div className="w-12 h-12 rounded-full bg-white shadow-md border-4 border-blue-600 flex items-center justify-center z-10">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 md:pl-12 md:text-left md:order-1">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">2</div>
                  <h3 className="text-xl font-bold mt-3 text-gray-900">Browse Curated Opportunities</h3>
                  <p className="mt-2 text-gray-600 max-w-md">
                    Explore our exclusive database of verified positions with visa sponsorship from reputable global companies.
                  </p>
                </div>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex-1 md:text-right md:pr-12 mb-4 md:mb-0">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold md:ml-auto">3</div>
                  <h3 className="text-xl font-bold mt-3 text-gray-900">Apply & Interview</h3>
                  <p className="mt-2 text-gray-600 max-w-md md:ml-auto">
                    Submit your application through our streamlined process and receive interview preparation support.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white shadow-md border-4 border-blue-600 flex items-center justify-center z-10">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 md:pl-12 md:text-left" />
              </motion.div>
              
              {/* Step 4 */}
              <motion.div 
                className="flex flex-col md:flex-row items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex-1 md:text-right md:pr-12 mb-4 md:mb-0 md:order-2" />
                <div className="w-12 h-12 rounded-full bg-white shadow-md border-4 border-blue-600 flex items-center justify-center z-10">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 md:pl-12 md:text-left md:order-1">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">4</div>
                  <h3 className="text-xl font-bold mt-3 text-gray-900">Secure Placement & Relocation</h3>
                  <p className="mt-2 text-gray-600 max-w-md">
                    Receive visa guidance, relocation assistance, and ongoing support as you transition to your new role.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700" />
            
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16">
              <div className="w-64 h-64 rounded-full bg-white opacity-10 blur-xl" />
            </div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16">
              <div className="w-64 h-64 rounded-full bg-white opacity-10 blur-xl" />
            </div>
            
            <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-16 text-center md:text-left">
              <div className="md:flex md:items-center md:justify-between">
                <div className="md:max-w-2xl">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-4xl">
                    Ready to accelerate your global career?
                  </h2>
                  <p className="mt-4 text-lg text-blue-100 max-w-md">
                    Join thousands of professionals who have transformed their careers with VizzarJobs elite opportunities.
                  </p>
                </div>
                <div className="mt-8 md:mt-0">
                  <Link 
                    href="/profile" 
                    className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 shadow-lg hover:shadow-xl transition duration-300"
                  >
                    Create Your Profile
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
