"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("");

  // Handle scroll to track active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Get all section elements
      const sections = document.querySelectorAll("section[id]");
      
      // Find the current visible section
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on load
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  // Helper function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Accounting for fixed header
        behavior: "smooth"
      });
    }
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
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Last updated: June 1, 2024
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 mb-20">
        {/* Sidebar navigation for desktop */}
        <div className="lg:w-1/4 hidden lg:block">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">On this page</h3>
              <ul className="space-y-2">
                {[
                  { id: "introduction", label: "Introduction" },
                  { id: "information-collection", label: "Information We Collect" },
                  { id: "use-of-information", label: "How We Use Your Information" },
                  { id: "information-sharing", label: "Information Sharing" },
                  { id: "cookies", label: "Cookies and Tracking" },
                  { id: "data-security", label: "Data Security" },
                  { id: "user-rights", label: "Your Rights" },
                  { id: "children", label: "Children's Privacy" },
                  { id: "international", label: "International Data Transfers" },
                  { id: "changes", label: "Changes to This Policy" },
                  { id: "contact", label: "Contact Us" }
                ].map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left w-full py-1 px-2 rounded ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Have questions about your privacy?{" "}
                    <Link href="/contact" className="text-blue-600 hover:underline">
                      Contact us
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <motion.div 
          className="lg:w-3/4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <motion.section id="introduction" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  VizzarJobs ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p>
                  We value your trust and are committed to handling your personal information with care and transparency. This policy applies to all information collected through our website, mobile application, and any related services, sales, marketing, or events.
                </p>
                <p>
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </div>
            </motion.section>

            <motion.section id="information-collection" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="prose prose-blue max-w-none">
                <h3>Personal Information</h3>
                <p>
                  We collect personal information that you voluntarily provide to us when you register on our platform, express interest in obtaining information about us or our products and services, participate in activities on the platform, or otherwise contact us.
                </p>
                <p>
                  The personal information we collect may include:
                </p>
                <ul>
                  <li>Name, email address, and contact information</li>
                  <li>Professional details such as work experience, education, and skills</li>
                  <li>Resume/CV and cover letters</li>
                  <li>Employment preferences and job search criteria</li>
                  <li>For employers: company details, job listings, and hiring criteria</li>
                  <li>Account credentials</li>
                  <li>Payment information for premium services</li>
                </ul>

                <h3 className="mt-6">Automatically Collected Information</h3>
                <p>
                  When you visit our website, we may automatically collect certain information about your device, including:
                </p>
                <ul>
                  <li>IP address</li>
                  <li>Browser and device characteristics</li>
                  <li>Operating system</li>
                  <li>Language preferences</li>
                  <li>Referring URLs</li>
                  <li>Information about how you interact with our platform</li>
                </ul>
                <p>
                  This information is primarily needed to maintain the security and operation of our platform, and for internal analytics and reporting purposes.
                </p>
              </div>
            </motion.section>

            <motion.section id="use-of-information" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  We use personal information collected via our platform for a variety of business purposes described below:
                </p>
                <ul>
                  <li><strong>Operate and maintain our platform</strong> - Including creating and managing your account and providing customer support.</li>
                  <li><strong>Improve our services</strong> - We may use feedback to improve our products and services.</li>
                  <li><strong>Facilitate the job application process</strong> - Including sharing job seeker information with potential employers when applications are submitted.</li>
                  <li><strong>Personalize user experience</strong> - We may use information to understand how users interact with our platform and provide personalized content and job recommendations.</li>
                  <li><strong>Process transactions</strong> - We may use the information to process payments and fulfill orders for our premium services.</li>
                  <li><strong>Marketing and communications</strong> - We may use your information to send you marketing communications, newsletters, and other information that may be of interest to you.</li>
                  <li><strong>Analytics and performance tracking</strong> - To monitor usage and performance of our platform.</li>
                </ul>
              </div>
            </motion.section>

            <motion.section id="information-sharing" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  We may share information in the following situations:
                </p>
                <ul>
                  <li><strong>With employers</strong> - When job seekers apply for positions, their information is shared with the relevant employers.</li>
                  <li><strong>With service providers</strong> - We may share your information with third-party vendors, service providers, contractors or agents who perform services for us.</li>
                  <li><strong>Business transfers</strong> - We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                  <li><strong>With your consent</strong> - We may disclose your personal information for any purpose with your consent.</li>
                  <li><strong>Legal obligations</strong> - We may disclose your information where we are legally required to do so.</li>
                </ul>
                <p>
                  We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
                </p>
              </div>
            </motion.section>

            <motion.section id="cookies" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  We use cookies and similar tracking technologies to track activity on our platform and store certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
                </p>
                <p>
                  These technologies are used for:
                </p>
                <ul>
                  <li>Keeping you signed in</li>
                  <li>Understanding how you use our platform</li>
                  <li>Personalizing your experience</li>
                  <li>Analyzing trends and usage patterns</li>
                  <li>Administering the website</li>
                </ul>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
                </p>
              </div>
            </motion.section>

            <motion.section id="data-security" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                </p>
                <p>
                  We strive to use commercially acceptable means to protect your personal information, but we cannot guarantee its absolute security.
                </p>
              </div>
            </motion.section>

            <motion.section id="user-rights" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  Depending on where you reside, you may have various rights regarding your personal information, including:
                </p>
                <ul>
                  <li><strong>Access</strong> - You can request copies of your personal information.</li>
                  <li><strong>Rectification</strong> - You can request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                  <li><strong>Erasure</strong> - You can request that we erase your personal information under certain conditions.</li>
                  <li><strong>Restriction of processing</strong> - You can request that we restrict the processing of your personal information under certain conditions.</li>
                  <li><strong>Data portability</strong> - You can request that we transfer the data we've collected to another organization or directly to you under certain conditions.</li>
                  <li><strong>Objection to processing</strong> - You can object to our processing of your personal information under certain conditions.</li>
                </ul>
                <p>
                  If you wish to exercise any of these rights, please contact us using the details provided in the "Contact Us" section.
                </p>
              </div>
            </motion.section>

            <motion.section id="children" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  Our platform is not intended for individuals under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
                </p>
              </div>
            </motion.section>

            <motion.section id="international" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  Our platform operates globally, and your information may be transferred to, stored, and processed in countries other than the country you reside in. These countries may have data protection laws that are different from the laws of your country.
                </p>
                <p>
                  By providing your personal information, you consent to these transfers. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
                </p>
              </div>
            </motion.section>

            <motion.section id="changes" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>
            </motion.section>

            <motion.section id="contact" className="mb-6" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul>
                  <li>By email: <a href="mailto:privacy@vizzarjobs.com" className="text-blue-600">privacy@vizzarjobs.com</a></li>
                  <li>By phone: +27 68 664 3827</li>
                  <li>By mail: 1 Dock Road, V&A Waterfront, Cape Town, 8001, South Africa</li>
                </ul>
              </div>
            </motion.section>
          </div>

          {/* Back to top button */}
          <div className="text-center mt-10">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              Back to top
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
