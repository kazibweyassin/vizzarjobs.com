"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
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
  HelpCircle
} from "lucide-react";

// Question circle component
const QuestionCircle = () => {
  return <HelpCircle className="w-5 h-5 text-amber-500" />;
};

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

interface TabContent {
  title: string;
  description: string;
  steps: Step[];
  benefits: {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
  }[];
  cta: {
    text: string;
    link: string;
  };
}

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"jobseekers" | "employers">("jobseekers");
  
  const tabContents: Record<"jobseekers" | "employers", TabContent> = {
    jobseekers: {
      title: "Your Path to Global Tech Opportunities",
      description: "We've streamlined the process of finding and applying for international tech roles with visa sponsorship",
      steps: [
        {
          title: "Create Your Profile",
          description: "Sign up and build a comprehensive profile highlighting your skills, experience, and career goals. Add your tech stack, preferred locations, and visa requirements.",
          icon: UserCheck,
          color: "bg-blue-500"
        },
        {
          title: "Discover Opportunities",
          description: "Browse our curated selection of visa-sponsored tech positions from verified global employers actively seeking African talent.",
          icon: Search,
          color: "bg-purple-500"
        },
        {
          title: "Apply with Confidence",
          description: "Submit applications directly through our platform. Our streamlined process ensures employers see your complete profile and qualifications.",
          icon: CheckSquare,
          color: "bg-green-500"
        },
        {
          title: "Interview and Succeed",
          description: "Connect with employers, showcase your talents in interviews, and receive support throughout the visa sponsorship and relocation process.",
          icon: Rocket,
          color: "bg-amber-500"
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
          icon: CheckCircle,
          color: "text-green-500"
        },
        {
          title: "Career Growth",
          description: "Access global opportunities that accelerate your professional development and earning potential.",
          icon: GraduationCap,
          color: "text-purple-500"
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
          color: "bg-blue-500"
        },
        {
          title: "Post Visa-Sponsored Roles",
          description: "Create detailed job listings with comprehensive information about the position, requirements, benefits, and visa sponsorship details.",
          icon: Briefcase,
          color: "bg-purple-500"
        },
        {
          title: "Review Qualified Candidates",
          description: "Browse applications from pre-screened candidates who match your requirements and have the skills you need.",
          icon: FileCheck,
          color: "bg-green-500"
        },
        {
          title: "Hire and Onboard",
          description: "Connect with promising candidates, conduct interviews, and get support throughout the hiring and visa sponsorship process.",
          icon: Users,
          color: "bg-amber-500"
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
          icon: Lightbulb,
          color: "text-green-500"
        },
        {
          title: "Diversity Benefits",
          description: "Enrich your team with diverse perspectives, experiences, and innovative problem-solving approaches.",
          icon: Star,
          color: "text-purple-500"
        }
      ],
      cta: {
        text: "Post a Job",
        link: "/post-job"
      }
    }
  };
  
  const activeContent = tabContents[activeTab];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-center"></div>
        </div>
        <motion.div 
          className="max-w-6xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How VizzarJobs Works</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
            Connecting exceptional African tech talent with global opportunities in a few simple steps
          </p>
        </motion.div>
      </section>

      {/* Tab Selection */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-2 flex justify-center mb-8 max-w-md mx-auto">
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 text-lg flex-1 ${
                activeTab === "jobseekers"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("jobseekers")}
            >
              For Job Seekers
            </button>
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 text-lg flex-1 ${
                activeTab === "employers"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("employers")}
            >
              For Employers
            </button>
          </div>
          
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-800 border-blue-200">
              {activeTab === "jobseekers" ? "For Job Seekers" : "For Employers"}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {activeContent.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeContent.description}
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Process Steps */}
      <section className="py-8 mb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {activeContent.steps.map((step, index) => (
                <motion.div 
                  key={step.title}
                  className="bg-white p-8 rounded-xl shadow-md border border-gray-100 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                      {step.icon && <step.icon className="w-8 h-8 text-white" />}
                    </div>
                  </div>
                  <div className="text-center pt-10 pb-6">
                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Use VizzarJobs?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {activeTab === "jobseekers" 
                ? "We focus exclusively on connecting African tech talent with global opportunities"
                : "Find exceptional tech talent ready for international roles and visa sponsorship"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {activeContent.benefits.map((benefit, index) => (
              <motion.div 
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  {benefit.icon && <benefit.icon className={`w-12 h-12 ${benefit.color}`} />}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Success Stories Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-purple-100 text-purple-800 border-purple-200">
              Success Stories
            </Badge>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              {activeTab === "jobseekers" 
                ? "African Developers Going Global"
                : "Companies Finding Exceptional Talent"}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* First Testimonial */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-2xl">"</span>
              </div>
              
              <div className="mb-6 pt-2">
                <p className="text-gray-600 italic">
                  {activeTab === "jobseekers" 
                    ? "VizzarJobs changed my life. I went from working locally in Lagos to joining a tech company in Amsterdam. The visa sponsorship process was seamless thanks to their guidance."
                    : "Finding developers with the right skills who were also interested in relocation was always a challenge. VizzarJobs solved this by connecting us with pre-vetted candidates eager for international opportunities."}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {activeTab === "jobseekers" ? "OP" : "JR"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {activeTab === "jobseekers" ? "Oluwaseun P." : "Jessica R."}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeTab === "jobseekers" ? "Backend Developer, Amsterdam" : "CTO, TechNova Solutions"}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Second Testimonial */}
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute -top-5 -left-5 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-2xl">"</span>
              </div>
              
              <div className="mb-6 pt-2">
                <p className="text-gray-600 italic">
                  {activeTab === "jobseekers" 
                    ? "After years of trying to find visa-sponsored roles, I found three opportunities within my first week on VizzarJobs. Now I'm working as a Senior React Developer in Berlin."
                    : "The quality of candidates we've hired through VizzarJobs has been exceptional. They bring unique perspectives and skills that have strengthened our engineering team considerably."}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {activeTab === "jobseekers" ? "KM" : "MS"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {activeTab === "jobseekers" ? "Kwame M." : "Michael S."}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeTab === "jobseekers" ? "Frontend Developer, Berlin" : "Head of Engineering, DataFlow Inc."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-3 py-1 bg-amber-100 text-amber-800 border-amber-200">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Common Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QuestionCircle />
                  {activeTab === "jobseekers" 
                    ? "Do I need to pay to apply for jobs?"
                    : "How do you verify tech talent?"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {activeTab === "jobseekers" 
                    ? "No, VizzarJobs is completely free for job seekers. We make our revenue from employers who post job listings."
                    : "We have a rigorous verification process that includes technical assessments, credential verification, and interviews to ensure the quality of candidates on our platform."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QuestionCircle />
                  {activeTab === "jobseekers" 
                    ? "What kind of support do you offer for visa applications?"
                    : "What is the typical hiring timeline?"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {activeTab === "jobseekers" 
                    ? "While we don't directly process visas, we provide resources, checklists, and connect you with employers who have established visa sponsorship processes."
                    : "The timeline varies, but most companies find and hire candidates within 4-6 weeks. Visa processing typically takes an additional 4-12 weeks depending on the country."}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QuestionCircle />
                  {activeTab === "jobseekers" 
                    ? "Which countries do you have job opportunities in?"
                    : "What costs are involved in hiring through VizzarJobs?"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {activeTab === "jobseekers" 
                    ? "We feature opportunities primarily in the US, UK, Canada, Germany, Netherlands, Australia, and other tech hubs that offer visa sponsorship."
                    : "We have transparent pricing based on the number of roles you post. There are no hidden fees, and we don't charge placement fees like traditional recruiting agencies."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">2,500+</div>
              <p className="text-gray-600">Tech Professionals</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">350+</div>
              <p className="text-gray-600">Global Companies</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">15+</div>
              <p className="text-gray-600">Countries</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">85%</div>
              <p className="text-gray-600">Placement Rate</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-center"></div>
        </div>
        <motion.div 
          className="max-w-6xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10 text-blue-100">
            {activeTab === "jobseekers"
              ? "Take the first step toward your international tech career. Browse jobs with visa sponsorship today."
              : "Connect with exceptional African tech talent ready to contribute to your global team."}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link 
                href={activeContent.cta.link}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2"
              >
                {activeContent.cta.text}
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link 
                href="/contact"
                className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition-colors shadow-lg"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
