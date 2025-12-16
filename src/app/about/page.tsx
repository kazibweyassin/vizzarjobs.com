"use client";

import Link from "next/link";
import { 
  Briefcase,
  Building2,
  Mail
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex gap-12">
          {/* Left Sidebar - Navigation */}
          <aside className="w-64 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">
              About us
            </h2>
            <nav className="mt-6 space-y-2">
              <Link 
                href="/about" 
                className="block text-blue-600 font-medium py-2"
              >
                What we are
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-500 hover:text-gray-900 py-2 transition-colors"
              >
                Contact us
              </Link>
              <Link 
                href="/terms-of-service" 
                className="block text-gray-500 hover:text-gray-900 py-2 transition-colors"
              >
                Privacy policy
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <div className="space-y-12">
              {/* What we are */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  What we are
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    VizzarJobs is East Africa's professional job platform connecting talented professionals 
                    with quality opportunities across Uganda, Kenya, Rwanda, and Tanzania. We serve as a 
                    trusted marketplace where job seekers can discover opportunities in Technology, Healthcare, 
                    Finance, Education, Sales, and more.
                  </p>
                  <p>
                    Our platform aggregates job listings from verified employers, making it easy for professionals 
                    to find their next career opportunity. We focus on connecting East African talent with 
                    reputable companies across the region.
                  </p>
                </div>
              </section>

              {/* Our mission */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Our mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  To connect East African professionals with quality job opportunities across diverse industries, 
                  making career advancement accessible and transparent for everyone in the region. We're committed 
                  to building a trusted platform that helps professionals find meaningful work and enables employers 
                  to discover top talent.
                </p>
              </section>

              {/* How to contact us */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  How to contact us
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions or suggestions, do not hesitate to{" "}
                  <Link href="/contact" className="text-blue-600 hover:underline">
                    contact us
                  </Link>
                  .
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
