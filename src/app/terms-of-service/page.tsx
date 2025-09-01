"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
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
            Terms of Service
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
                  { id: "definitions", label: "Definitions" },
                  { id: "account", label: "User Account" },
                  { id: "content", label: "User Content" },
                  { id: "intellectual-property", label: "Intellectual Property" },
                  { id: "prohibited", label: "Prohibited Activities" },
                  { id: "termination", label: "Termination" },
                  { id: "disclaimers", label: "Disclaimers" },
                  { id: "limitation", label: "Limitation of Liability" },
                  { id: "indemnification", label: "Indemnification" },
                  { id: "modifications", label: "Modifications" },
                  { id: "governing-law", label: "Governing Law" },
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
                    Have questions about our terms?{" "}
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
                  Welcome to VizzarJobs. These Terms of Service ("Terms") govern your use of the VizzarJobs website, services, and applications (collectively, the "Service").
                </p>
                <p>
                  By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, then you do not have permission to access or use the Service.
                </p>
                <p>
                  VizzarJobs is a platform designed to connect job seekers with employers offering visa sponsorship opportunities. Our Service provides various features including job listings, employer profiles, application processing, and related services.
                </p>
              </div>
            </motion.section>

            <motion.section id="definitions" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definitions</h2>
              <div className="prose prose-blue max-w-none">
                <ul>
                  <li><strong>"User"</strong> refers to individuals who access or use the Service, including job seekers and employers.</li>
                  <li><strong>"Job Seeker"</strong> refers to users who create accounts to search and apply for job opportunities.</li>
                  <li><strong>"Employer"</strong> refers to users who create accounts to post job listings and review applications.</li>
                  <li><strong>"Content"</strong> includes text, graphics, logos, images, audio, video, software, data compilations, and other materials.</li>
                  <li><strong>"User Content"</strong> means any content submitted, posted, or displayed by users on the Service.</li>
                </ul>
              </div>
            </motion.section>

            <motion.section id="account" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Account</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  To access certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information.
                </p>
                <p>
                  You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account.
                </p>
                <p>
                  You must notify VizzarJobs immediately of any breach of security or unauthorized use of your account. VizzarJobs cannot and will not be liable for any loss or damage arising from your failure to comply with this section.
                </p>
                <p>
                  VizzarJobs reserves the right to suspend or terminate your account if any information provided is inaccurate, false, or outdated.
                </p>
              </div>
            </motion.section>

            <motion.section id="content" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Content</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  By submitting, posting, or displaying User Content on the Service, you grant VizzarJobs a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute such content in any media.
                </p>
                <p>
                  You represent and warrant that:
                </p>
                <ul>
                  <li>You own or have the necessary rights to use and authorize VizzarJobs to use your User Content as described in these Terms.</li>
                  <li>Your User Content does not violate the rights of any third party, including copyright, trademark, privacy, or other personal or proprietary rights.</li>
                  <li>Your User Content does not contain material that is defamatory, obscene, offensive, hateful, or otherwise objectionable.</li>
                </ul>
                <p>
                  VizzarJobs has the right but not the obligation to monitor and edit all User Content provided by users.
                </p>
              </div>
            </motion.section>

            <motion.section id="intellectual-property" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of VizzarJobs and its licensors.
                </p>
                <p>
                  The Service is protected by copyright, trademark, and other laws of both the South Africa and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of VizzarJobs.
                </p>
              </div>
            </motion.section>

            <motion.section id="prohibited" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Activities</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  You agree not to use the Service:
                </p>
                <ul>
                  <li>In any way that violates any applicable national or international law or regulation.</li>
                  <li>To exploit or harm or attempt to exploit or harm minors in any way.</li>
                  <li>To transmit any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
                  <li>To impersonate or attempt to impersonate VizzarJobs, a VizzarJobs employee, another user, or any other person or entity.</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm VizzarJobs or users of the Service.</li>
                  <li>To interfere with or disrupt the Service or servers or networks connected to the Service.</li>
                </ul>
              </div>
            </motion.section>

            <motion.section id="termination" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  VizzarJobs may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
                <p>
                  If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
                </p>
                <p>
                  All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                </p>
              </div>
            </motion.section>

            <motion.section id="disclaimers" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p>
                  VIZZARJOBS EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  VIZZARJOBS MAKES NO WARRANTY THAT:
                </p>
                <ul>
                  <li>THE SERVICE WILL MEET YOUR REQUIREMENTS</li>
                  <li>THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE</li>
                  <li>THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE</li>
                </ul>
              </div>
            </motion.section>

            <motion.section id="limitation" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  IN NO EVENT SHALL VIZZARJOBS, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </p>
                <ul>
                  <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE</li>
                  <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE</li>
                  <li>ANY CONTENT OBTAINED FROM THE SERVICE</li>
                  <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
                </ul>
                <p>
                  WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
              </div>
            </motion.section>

            <motion.section id="indemnification" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  You agree to defend, indemnify, and hold harmless VizzarJobs, its directors, employees, partners, agents, suppliers, and affiliates, from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
                </p>
              </div>
            </motion.section>

            <motion.section id="modifications" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications to Terms</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  VizzarJobs reserves the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <p>
                  By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
                </p>
              </div>
            </motion.section>

            <motion.section id="governing-law" className="mb-12" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  These Terms shall be governed and construed in accordance with the laws of South Africa, without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                </p>
              </div>
            </motion.section>

            <motion.section id="contact" className="mb-6" variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
              <div className="prose prose-blue max-w-none">
                <p>
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul>
                  <li>By email: <a href="mailto:legal@vizzarjobs.com" className="text-blue-600">legal@vizzarjobs.com</a></li>
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
