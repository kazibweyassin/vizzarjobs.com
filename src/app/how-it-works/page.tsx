import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
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
  Users
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How VizzarJobs Works</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
            Connecting exceptional African tech talent with global opportunities in a few simple steps
          </p>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center pt-10 pb-6">
                  <h3 className="text-2xl font-semibold mb-3">Create Profile</h3>
                  <p className="text-gray-600">
                    Sign up and complete your professional profile with your skills, experience, and preferences
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center pt-10 pb-6">
                  <h3 className="text-2xl font-semibold mb-3">Discover Jobs</h3>
                  <p className="text-gray-600">
                    Browse curated job listings from companies offering visa sponsorship and global roles
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                    <FileCheck className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center pt-10 pb-6">
                  <h3 className="text-2xl font-semibold mb-3">Apply With Ease</h3>
                  <p className="text-gray-600">
                    Submit applications directly through our platform with your polished profile
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center shadow-lg">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center pt-10 pb-6">
                  <h3 className="text-2xl font-semibold mb-3">Go Global</h3>
                  <p className="text-gray-600">
                    Receive offers and start your international tech career journey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* For Job Seekers */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 bg-blue-100 text-blue-800 border-blue-200">For Job Seekers</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Your Path to Global Tech Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've streamlined the process of finding and applying to international tech roles
            </p>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Original content below */}

        {/* Process Flow */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <CardTitle>Company Discovers Missing Listing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    When employers try to post a job, they see their company isn't in our directory.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700 italic">
                      "Don't see your company? <Link href="/contact" className="text-blue-600 underline">Contact us to add it</Link>."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <ArrowRight className="w-8 h-8 text-gray-400 transform lg:rotate-0 rotate-90" />
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <CardTitle>Contact Form Submission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Company fills out comprehensive information including visa sponsorship confirmation.
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/contact"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4" />
                      Try Contact Form
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <CardTitle>Admin Review Process</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Our team reviews company information, verifies visa sponsorship capability, and makes approval decisions.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Clock className="w-4 h-4 mr-1" />
                      2-3 Business Days
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            <ArrowRight className="w-8 h-8 text-gray-400 transform lg:rotate-0 rotate-90" />
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <CardTitle>Automatic Company Creation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Upon approval, company profile is automatically created and becomes available for job postings.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Auto-Generated
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Final Step */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <CardTitle>Ready to Hire!</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Company can now post visa-sponsored jobs and connect with African tech talent seeking international opportunities.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/post-job"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Post a Job
                  </Link>
                  <Link
                    href="/companies"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Browse Companies
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Why This Process Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  Quality Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manual review ensures only legitimate companies that can sponsor visas are added to the platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  Clear Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Companies receive email updates throughout the process and know exactly what to expect.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  Seamless Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Once approved, companies can immediately start posting jobs without additional setup.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Add Your Company?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join the platform connecting African tech talent with global visa-sponsored opportunities.
                The process is simple, fast, and designed to get you hiring quickly.
              </p>
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 text-lg font-medium"
              >
                <Building2 className="w-5 h-5" />
                Start Company Addition Process
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10 text-blue-100">
            Whether you're looking for your next tech role or seeking exceptional talent, VizzarJobs is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/jobs"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Browse Jobs
            </Link>
            <Link 
              href="/post-job"
              className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition-colors shadow-lg"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
