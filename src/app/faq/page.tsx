"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

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

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isExpanded = (id: string) => {
    return expandedQuestions[id] || false;
  };

  const categories = [
    { id: "general", name: "General" },
    { id: "jobseekers", name: "For Job Seekers" },
    { id: "employers", name: "For Employers" },
    { id: "visa", name: "Visa Sponsorship" },
    { id: "billing", name: "Billing & Pricing" },
  ];

  // FAQ data by category
  const faqsByCategory = {
    general: [
      {
        id: "what-is-vizzarjobs",
        question: "What is VizzarJobs?",
        answer: "VizzarJobs is a specialized job platform that connects African professionals with global employers offering visa sponsorship. We focus on tech and professional roles that provide relocation opportunities to countries like the US, UK, Canada, Germany, and more."
      },
      {
        id: "how-does-it-work",
        question: "How does VizzarJobs work?",
        answer: "For job seekers, create a profile, browse visa-sponsored positions, and apply directly through our platform. For employers, post job listings specifically targeting candidates open to relocation, review applications, and connect with qualified talent."
      },
      {
        id: "what-countries",
        question: "What countries do you cover?",
        answer: "We primarily feature opportunities in the United States, United Kingdom, Canada, Germany, Netherlands, Australia, and other tech hubs that offer visa sponsorship programs for skilled professionals."
      },
      {
        id: "who-can-use",
        question: "Who can use VizzarJobs?",
        answer: "Our platform is designed for skilled professionals from Africa seeking international opportunities, as well as companies around the world looking to hire African talent and willing to sponsor work visas."
      },
      {
        id: "is-it-legitimate",
        question: "Is VizzarJobs legitimate?",
        answer: "Yes, VizzarJobs is a legitimate job platform. We verify all employers before they can post jobs, and we ensure that all listed positions genuinely offer visa sponsorship. Our mission is to connect African talent with genuine global opportunities."
      }
    ],
    jobseekers: [
      {
        id: "create-account",
        question: "How do I create an account?",
        answer: "Click on the 'Sign Up' button in the top right corner of our homepage. You can register using your email address or sign in with Google or LinkedIn. Complete your profile with your professional experience, skills, and visa preferences."
      },
      {
        id: "is-free",
        question: "Is it free to use VizzarJobs as a job seeker?",
        answer: "Yes, our Basic plan for job seekers is completely free. This allows you to create a profile and apply to up to 3 jobs per month. For unlimited applications and premium features, we offer a Premium plan at $29/month."
      },
      {
        id: "improve-chances",
        question: "How can I improve my chances of getting hired?",
        answer: "Complete your profile 100%, including detailed work experience, education, and skills. Upload a professional CV tailored to your target roles. Consider upgrading to our Premium plan for priority application review and advanced matching features."
      },
      {
        id: "visa-requirements",
        question: "Do I need to have visa paperwork ready to apply?",
        answer: "No, you don't need any visa paperwork to apply for jobs. If hired, the employer will guide you through the visa sponsorship process and let you know what documents will be required."
      },
      {
        id: "job-updates",
        question: "How do I get notified about new job opportunities?",
        answer: "You can set up job alerts based on your preferences (location, role, salary range, etc.). You'll receive email notifications when new matching positions are posted. Premium users receive early access to new job listings."
      }
    ],
    employers: [
      {
        id: "post-job",
        question: "How do I post a job?",
        answer: "Create an employer account, subscribe to our Employer plan, and click on 'Post a Job' from your dashboard. Fill in the job details including role, requirements, location, and visa sponsorship information."
      },
      {
        id: "pricing-employers",
        question: "What does it cost to post jobs?",
        answer: "Our standard Employer plan costs $199/month and allows you to post up to 5 job listings, along with access to our candidate database and applicant tracking tools. For larger hiring needs, we offer customized Enterprise plans."
      },
      {
        id: "how-candidates-vetted",
        question: "How are candidates vetted?",
        answer: "All candidates on our platform have verified profiles. We check professional credentials and ensure candidates meet basic eligibility criteria for international employment. Our platform also allows you to set specific screening questions for each position."
      },
      {
        id: "visa-expertise",
        question: "Does VizzarJobs provide visa expertise?",
        answer: "Yes, our Employer plans include basic visa sponsorship guidance. We can connect you with immigration partners if you need specialized assistance with the visa application process for your hires."
      },
      {
        id: "find-candidates",
        question: "Can I search for candidates directly?",
        answer: "Yes, with an Employer subscription, you can proactively search our talent pool based on skills, experience level, education, and other criteria. You can invite promising candidates to apply to your open positions."
      }
    ],
    visa: [
      {
        id: "visa-types",
        question: "What types of visas do employers on VizzarJobs sponsor?",
        answer: "This varies by country and employer. Common visa types include H-1B (USA), Tier 2 Skilled Worker (UK), Express Entry (Canada), EU Blue Card (Germany/EU), and TSS 482 (Australia). Each job listing specifies the type of visa sponsorship offered."
      },
      {
        id: "sponsorship-guarantee",
        question: "Does applying through VizzarJobs guarantee visa sponsorship?",
        answer: "While all jobs on our platform offer sponsorship, final visa approval depends on meeting the specific country's immigration requirements and the employer's hiring decision. We ensure all listings are from employers genuinely willing to sponsor visas."
      },
      {
        id: "visa-costs",
        question: "Who covers visa application costs?",
        answer: "This varies by employer. Some companies cover all visa-related expenses, while others may share costs or require the employee to cover certain fees. This information is typically discussed during the interview process."
      },
      {
        id: "visa-requirements-country",
        question: "What are the visa requirements for different countries?",
        answer: "Requirements vary significantly by country. Generally, you'll need relevant qualifications, work experience, and sometimes language proficiency. Some countries have minimum salary thresholds or specific education requirements. We provide country-specific guides in our resources section."
      },
      {
        id: "relocation-assistance",
        question: "Do employers provide relocation assistance?",
        answer: "Many do, but this varies by company. Some offer comprehensive relocation packages including flights, temporary accommodation, and settling-in services. Others may provide a fixed relocation allowance. This information is usually included in the job description or discussed during interviews."
      }
    ],
    billing: [
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers. All payments are processed securely through our payment partners."
      },
      {
        id: "cancel-subscription",
        question: "How do I cancel my subscription?",
        answer: "You can cancel your subscription at any time from your account settings. Navigate to the 'Billing' section and click on 'Cancel Subscription'. Your access will continue until the end of your current billing period."
      },
      {
        id: "refund-policy",
        question: "What is your refund policy?",
        answer: "We offer a 14-day money-back guarantee for new subscriptions if you're not satisfied with our service. After this period, we do not provide refunds for partial subscription periods."
      },
      {
        id: "upgrade-downgrade",
        question: "Can I upgrade or downgrade my plan?",
        answer: "Yes, you can change your subscription plan at any time from your account settings. When upgrading, you'll be charged the prorated difference immediately. When downgrading, the new rate will apply at your next billing cycle."
      },
      {
        id: "invoice-receipt",
        question: "How do I get an invoice or receipt?",
        answer: "Invoices are automatically generated and emailed to you after each payment. You can also access all your billing history and download invoices from the 'Billing' section of your account settings."
      }
    ]
  };

  return (
    <div className="bg-gradient-to-br from-white via-[#f8faff] to-[#f0f4ff] min-h-screen">
      <div className="pt-20 pb-10 text-center">
        <motion.div 
          className="mx-auto max-w-3xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about VizzarJobs, visa sponsorship, and international career opportunities.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 mb-20">
        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ questions and answers */}
        <motion.div 
          className="space-y-4"
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {faqsByCategory[activeCategory as keyof typeof faqsByCategory].map((faq) => (
            <motion.div
              key={faq.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(faq.id)}
                className="flex justify-between items-center w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-lg pr-4">{faq.question}</h3>
                <div className="flex-shrink-0">
                  {isExpanded(faq.id) ? (
                    <ChevronUp className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${
                isExpanded(faq.id) 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                <div className="px-6 py-4 border-t border-gray-100 bg-blue-50 bg-opacity-30">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Still have questions section */}
      <div className="bg-blue-600 text-white py-16 mb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Our team is here to help with any questions about international career opportunities, visa sponsorship, or using our platform.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 font-medium transition-colors"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Resources section */}
      <div className="max-w-5xl mx-auto px-4 mb-20">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Helpful Resources</h2>
          <p className="text-gray-600 mt-4">Explore our guides and resources for more detailed information</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              title: "Visa Sponsorship Guide",
              description: "Learn about different work visa types, requirements, and application processes for popular destination countries.",
              link: "/resources/visa-guide"
            },
            {
              title: "Resume & Interview Tips",
              description: "Expert advice on crafting a standout resume and acing interviews for international positions.",
              link: "/resources/career-tips"
            },
            {
              title: "Relocation Essentials",
              description: "Everything you need to know about relocating to a new country for work.",
              link: "/resources/relocation"
            },
            {
              title: "Employer Handbook",
              description: "A comprehensive guide for employers on international hiring and visa sponsorship processes.",
              link: "/resources/employer-guide"
            },
            {
              title: "Country Comparison Tool",
              description: "Compare living costs, salaries, and visa requirements across different countries.",
              link: "/resources/country-comparison"
            },
            {
              title: "Community Success Stories",
              description: "Real experiences from professionals who have successfully relocated through VizzarJobs.",
              link: "/success-stories"
            }
          ].map((resource, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <Link href={resource.link} className="text-blue-600 hover:text-blue-800 font-medium">
                Learn more →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
