"use client";

import { useState } from 'react';
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
  Zap,
  Sparkles,
  TrendingUp,
  Lock,
  Headphones
} from 'lucide-react';
import Link from 'next/link';

export default function TalentPoolLandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Globe,
      title: "Canadian AI/ML Hub",
      description: "Access exclusive opportunities with Canada's fastest-growing AI/ML companies",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Briefcase,
      title: "Smart Matching",
      description: "Our AI matches your skills with roles that fit your career trajectory",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FileText,
      title: "Portfolio Showcase",
      description: "Highlight your projects, research, and GitHub to stand out",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Enterprise-grade security with full control over your data",
      color: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    { text: "Visa sponsorship & relocation packages", icon: CheckCircle },
    { text: "Direct access to hiring managers", icon: CheckCircle },
    { text: "Personalized career coaching", icon: CheckCircle },
    { text: "Priority consideration for roles", icon: CheckCircle },
    { text: "Competitive salary insights", icon: CheckCircle },
    { text: "AI/ML-focused opportunities only", icon: CheckCircle }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "ML Engineer",
      company: "Now at DeepLearning AI",
      quote: "Found my dream role within 3 weeks. The process was seamless!",
      avatar: "🎯"
    },
    {
      name: "Marcus Johnson",
      role: "AI Researcher",
      company: "Now at Vector Institute",
      quote: "Exceptional matching algorithm - every opportunity was relevant.",
      avatar: "🚀"
    },
    {
      name: "Priya Sharma",
      role: "Data Scientist",
      company: "Now at Scale AI",
      quote: "The relocation support made my move to Canada stress-free.",
      avatar: "⭐"
    }
  ];

  const stats = [
    { number: "500+", label: "AI/ML Candidates", icon: Users },
    { number: "50+", label: "Canadian Partners", icon: Briefcase },
    { number: "92%", label: "Success Rate", icon: TrendingUp },
    { number: "$150K+", label: "Avg. Salary", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VizzarJobs
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#benefits" className="hover:text-blue-600 transition">Benefits</a>
            <a href="#testimonials" className="hover:text-blue-600 transition">Success Stories</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-20 md:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: "2s"}}></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              Join Canada's Premier AI/ML Talent Pool
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Next <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">AI/ML Opportunity</span> Awaits
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Get discovered by 50+ leading Canadian companies. We handle the matching, visa sponsorship, and relocation support while you focus on what you do best.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/talent-pool/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-shadow">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>

            <p className="text-sm text-slate-500">
              ✓ Free to join  ✓ Takes 5 minutes  ✓ No commitments
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700">Why Choose Us</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A comprehensive platform designed by AI/ML professionals for AI/ML professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="relative border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 overflow-hidden group cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  <CardHeader>
                    <div className={`inline-flex w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700">Member Perks</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Unlock Exclusive Benefits
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                When you join our talent pool, you get access to opportunities and support most other platforms don't offer.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700 group-hover:text-slate-900 transition">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-full -ml-16 -mb-16 opacity-50"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                    <Zap className="w-8 h-8 text-amber-500 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Fast Matching</div>
                      <div className="text-sm text-slate-600">Within 2-3 weeks</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                    <Lock className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Data Security</div>
                      <div className="text-sm text-slate-600">Enterprise-grade protection</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4">
                    <Headphones className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">24/7 Support</div>
                      <div className="text-sm text-slate-600">Dedicated support team</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700">Getting Started</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Three Simple Steps
            </h2>
            <p className="text-lg text-slate-600">
              From registration to your dream job in Canada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: 1, title: "Create Your Profile", desc: "Tell us about your AI/ML expertise, projects, and career goals in 5 minutes." },
              { step: 2, title: "Smart Matching", desc: "Our AI analyzes your profile and matches you with relevant opportunities." },
              { step: 3, title: "Get Hired", desc: "Companies reach out directly. We handle visa and relocation support." }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4 relative z-10 shadow-lg">
                    {item.step}
                  </div>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-1/3 h-1 bg-gradient-to-r from-blue-300 to-purple-300"></div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-center mb-2">{item.title}</h3>
                <p className="text-center text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pink-100 text-pink-700">Success Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Hear From Our Members
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 border-slate-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-lg font-semibold italic text-slate-700 mb-4">"{testimonial.quote}"</p>
                </CardHeader>
                <CardContent>
                  <div className="font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-screen"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Launch Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join 500+ AI/ML professionals who've found their next opportunity with us.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/talent-pool/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                <Zap className="mr-2 h-5 w-5" />
                Join for Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 font-semibold">
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 py-12 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">VizzarJobs</div>
              <p className="text-sm">Connecting top AI/ML talent with Canadian opportunities.</p>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">Product</div>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="hover:text-white transition">Features</a></div>
                <div><a href="#" className="hover:text-white transition">Pricing</a></div>
                <div><a href="#" className="hover:text-white transition">For Employers</a></div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">Company</div>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="hover:text-white transition">About</a></div>
                <div><a href="#" className="hover:text-white transition">Blog</a></div>
                <div><a href="#" className="hover:text-white transition">Contact</a></div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">Legal</div>
              <div className="space-y-2 text-sm">
                <div><a href="/privacy" className="hover:text-white transition">Privacy</a></div>
                <div><a href="/terms" className="hover:text-white transition">Terms</a></div>
                <div><a href="#" className="hover:text-white transition">Cookies</a></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>© 2024 VizzarJobs. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}