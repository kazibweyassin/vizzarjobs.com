
"use client";

import Link from "next/link";
import {
  Briefcase,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo & Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Vizzar<span className="text-blue-400">Jobs</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-sm">
              Connecting African tech talent with global opportunities. Find your dream job with visa sponsorship.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-blue-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-white">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-blue-400 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-300 hover:text-blue-400 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-blue-400 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-white">For Employers</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/post-job" className="text-gray-300 hover:text-blue-400 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-blue-400 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-blue-400 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  Hiring Solutions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-blue-400 flex items-center gap-1">
                  <ChevronRight className="w-4 h-4" />
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">123 Innovation Avenue, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+234800123456" className="text-gray-300 hover:text-blue-400">+234 800 123 456</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@vizzarjobs.com" className="text-gray-300 hover:text-blue-400">info@vizzarjobs.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="md:w-1/2">
              <h4 className="text-lg font-semibold text-white mb-2">Stay Updated</h4>
              <p className="text-gray-400">Get the latest jobs and industry news</p>
            </div>
            <div className="md:w-1/2">
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg text-gray-300 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Email address"
                />
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} VizzarJobs. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white text-sm">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
