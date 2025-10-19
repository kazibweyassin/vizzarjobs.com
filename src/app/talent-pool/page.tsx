"use client";

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { 
  Users, 
  Globe, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function TalentPoolLandingPage() {
  const features = [
    {
      icon: Globe,
      title: "Canadian AI/ML Opportunities",
      description: "Connect with leading Canadian AI/ML companies offering visa sponsorship and relocation support."
    },
    {
      icon: Briefcase,
      title: "AI/ML Specialized Matching",
      description: "Get matched with AI/ML opportunities that align with your technical skills and career goals."
    },
    {
      icon: FileText,
      title: "Portfolio Showcase",
      description: "Showcase your AI/ML projects, GitHub, and research publications to Canadian employers."
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your information is secure and only shared with verified Canadian AI/ML employers."
    }
  ];

  const benefits = [
    "Access to exclusive AI/ML job opportunities in Canada",
    "Direct connection with Canadian AI/ML hiring managers",
    "Visa sponsorship assistance for Canada",
    "Relocation support guidance",
    "AI/ML career development resources",
    "Priority consideration for AI/ML roles"
  ];

  const stats = [
    { number: "200+", label: "AI/ML Candidates" },
    { number: "25+", label: "Canadian AI/ML Companies" },
    { number: "Canada", label: "Primary Focus" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Hero Section */}
          <div className="relative">
            {/* Background Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/background.mp4" type="video/mp4" />
              {/* Fallback image if video fails to load */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                }}
              ></div>
            </video>
            <div className="absolute inset-0 bg-kale/70"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-opal-1 text-kale border-light-green">
            <Star className="w-4 h-4 mr-1" />
            Join Our AI/ML Talent Pool
          </Badge>
          
          <h1 className="text-5xl font-bold text-white mb-6">
            Connect with Canadian
            <span className="text-light-green"> AI/ML Companies</span>
          </h1>
          
          <p className="text-xl text-light-green mb-8 leading-relaxed">
            Join VizzarJobs AI/ML Talent Pool and get discovered by leading Canadian companies. 
            We specialize in connecting AI/ML professionals with Canadian companies offering 
            visa sponsorship and relocation support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/talent-pool/register">
              <Button size="lg" className="w-full sm:w-auto bg-emerald hover:bg-emerald/90 text-white">
                Join Talent Pool
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-light-green text-white hover:bg-opal-1 hover:text-kale">
              Learn More
            </Button>
          </div>
        </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald mb-2">{stat.number}</div>
                <div className="text-kale">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-opal-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kale mb-4">
              Why Join Our Talent Pool?
            </h2>
            <p className="text-lg text-grey-green max-w-2xl mx-auto">
              We provide a comprehensive platform that connects you with the right opportunities 
              while protecting your privacy and ensuring quality matches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-32 bg-cover bg-center" style={{
                      backgroundImage: `url(${[
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                        'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                      ][index]})`
                }}>
                  <div className="absolute inset-0 bg-emerald/20"></div>
                </div>
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-opal-1 rounded-lg flex items-center justify-center mb-4 -mt-6 relative z-10">
                    <feature.icon className="h-6 w-6 text-emerald" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What You Get
              </h2>
              <p className="text-lg text-gray-600">
                Exclusive benefits for talent pool members
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Register</h3>
              <p className="text-gray-600">
                Fill out our comprehensive form with your skills, experience, and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600">
                Our system matches you with relevant opportunities based on your profile.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Employers reach out directly when they find your profile interesting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through our talent pool.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/talent-pool/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Zap className="mr-2 h-5 w-5" />
                Join Now - It's Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
              View Success Stories
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 VizzarJobs. All rights reserved. | 
            <Link href="/privacy" className="text-blue-400 hover:underline ml-1">Privacy Policy</Link> | 
            <Link href="/terms" className="text-blue-400 hover:underline ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
