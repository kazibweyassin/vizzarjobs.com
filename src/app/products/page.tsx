'use client';

import Link from 'next/link';
import {
  Brain,
  BarChart3,
  Target,
  Users,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Code,
  Database,
  Cloud,
  Smartphone,
  Lock,
  Award,
  Lightbulb,
  Settings,
  Download,
  Play,
  FileText,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  icon: any;
  color: string;
  pricing: {
    starter: string;
    professional: string;
    enterprise: string;
  };
  isPopular?: boolean;
}

interface Feature {
  title: string;
  description: string;
  icon: any;
}

export default function ProductsPage() {
  const products: Product[] = [
    {
      id: 'ats-resume-builder',
      name: 'ATS Resume Builder',
      tagline: 'Create ATS-Optimized Resumes',
      description: 'Professional resume builder with real-time ATS scoring. Free to build, $2 per PDF download. Perfect for job seekers who want ATS-optimized resumes.',
      features: [
        'Real-time ATS compatibility scoring',
        '4 professional templates',
        'Free resume creation & editing',
        '$2 per PDF download'
      ],
      icon: FileText,
      color: 'from-green-600 to-emerald-600',
      pricing: {
        starter: 'Free',
        professional: '$2/PDF',
        enterprise: 'Bulk pricing'
      },
      isPopular: true
    },
    {
      id: 'vizzarmatch',
      name: 'VizzarMatch',
      tagline: 'AI-Powered Job Matching Engine',
      description: 'Our proprietary AI algorithm analyzes millions of data points to match candidates with the perfect opportunities.',
      features: [
        '95% accuracy in job matching',
        'Real-time skill gap analysis',
        'Predictive career path recommendations',
        'Multi-factor compatibility scoring'
      ],
      icon: Brain,
      color: 'from-blue-600 to-blue-700',
      pricing: {
        starter: 'Free',
        professional: '$29/month',
        enterprise: 'Custom'
      },
      isPopular: false
    },
    {
      id: 'vizzarinsights',
      name: 'VizzarInsights',
      tagline: 'Market Intelligence Platform',
      description: 'Comprehensive analytics and insights into tech job markets, salary trends, and industry movements.',
      features: [
        'Real-time market analytics',
        'Salary benchmarking tools',
        'Industry trend predictions',
        'Competitive intelligence reports'
      ],
      icon: BarChart3,
      color: 'from-green-600 to-green-700',
      pricing: {
        starter: '$99/month',
        professional: '$299/month',
        enterprise: 'Custom'
      }
    },
    {
      id: 'vizzartools',
      name: 'VizzarTools',
      tagline: 'Career Development Suite',
      description: 'Complete toolkit for career growth including resume optimization, interview prep, and skill assessments.',
      features: [
        'AI resume analyzer',
        'Interview preparation tools',
        'Skill assessment tests',
        'Career coaching sessions'
      ],
      icon: Target,
      color: 'from-purple-600 to-purple-700',
      pricing: {
        starter: '$19/month',
        professional: '$49/month',
        enterprise: 'Custom'
      }
    },
    {
      id: 'vizzarconnect',
      name: 'VizzarConnect',
      tagline: 'Professional Talent Network',
      description: 'Connect with industry professionals, mentors, and opportunities through our exclusive network.',
      features: [
        'Professional networking platform',
        'Mentorship matching',
        'Industry events and webinars',
        'Referral reward system'
      ],
      icon: Users,
      color: 'from-orange-600 to-orange-700',
      pricing: {
        starter: 'Free',
        professional: '$39/month',
        enterprise: 'Custom'
      }
    }
  ];

  const features: Feature[] = [
    {
      title: 'AI-Powered Matching',
      description: 'Our advanced algorithms analyze skills, experience, and cultural fit to find perfect matches.',
      icon: Brain
    },
    {
      title: 'Real-Time Analytics',
      description: 'Get instant insights into market trends, salary data, and hiring patterns.',
      icon: TrendingUp
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC 2 compliance and advanced data protection.',
      icon: Shield
    },
    {
      title: 'API Integration',
      description: 'Seamlessly integrate with your existing HR systems and workflows.',
      icon: Code
    },
    {
      title: 'Global Reach',
      description: 'Access talent and opportunities from over 50 countries worldwide.',
      icon: Globe
    },
    {
      title: 'Mobile Optimized',
      description: 'Full functionality available on mobile devices with native app experience.',
      icon: Smartphone
    }
  ];

  const enterpriseFeatures = [
    'Custom AI model training',
    'White-label solutions',
    'Dedicated account manager',
    'Priority support',
    'Advanced analytics dashboard',
    'Custom integrations',
    'SLA guarantees',
    'On-premise deployment options'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Our Products & Solutions</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive technology solutions for modern talent acquisition and career development
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <Card key={product.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 bg-gradient-to-r ${product.color} rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription className="text-sm font-medium">{product.tagline}</CardDescription>
                    </div>
                    {product.isPopular && (
                      <Badge className={`ml-auto ${product.id === 'ats-resume-builder' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' : 'bg-yellow-100 text-yellow-800'}`}>
                        {product.id === 'ats-resume-builder' ? (
                          <>
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </>
                        ) : (
                          'Popular'
                        )}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-900 mb-2">Pricing</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium">Starter</div>
                          <div className="text-gray-600">{product.pricing.starter}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Professional</div>
                          <div className="text-gray-600">{product.pricing.professional}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Enterprise</div>
                          <div className="text-gray-600">{product.pricing.enterprise}</div>
                        </div>
                      </div>
                    </div>

                    {product.id === 'ats-resume-builder' ? (
                      <Link href="/tools/resume-builder" className="block">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          <FileText className="w-4 h-4 mr-2" />
                          Create Resume
                          <DollarSign className="w-3 h-3 ml-1" />
                          <span className="text-xs ml-1 opacity-90">$2 PDF</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Features */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge technology to deliver exceptional results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enterprise Solutions */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-900 to-slate-800 text-white mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="w-6 h-6" />
              Enterprise Solutions
            </CardTitle>
            <CardDescription className="text-slate-300">
              Custom solutions for large organizations and enterprise clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Enterprise Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {enterpriseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">Custom</div>
                <div className="text-slate-300 mb-4">Pricing tailored to your needs</div>
                <Button className="bg-white text-slate-900 hover:bg-gray-100">
                  Contact Sales
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API & Integrations */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              API & Integrations
            </CardTitle>
            <CardDescription>
              Powerful APIs and pre-built integrations for seamless workflow integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">REST API</h3>
                <p className="text-sm text-gray-600">Comprehensive REST API for all platform features</p>
              </div>
              <div className="text-center">
                <Cloud className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Cloud Integrations</h3>
                <p className="text-sm text-gray-600">Connect with AWS, Azure, and Google Cloud</p>
              </div>
              <div className="text-center">
                <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">HR Systems</h3>
                <p className="text-sm text-gray-600">Integrate with Workday, BambooHR, and more</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" className="mr-4">
                <Download className="w-4 h-4 mr-2" />
                API Documentation
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Play className="w-4 h-4 mr-2" />
                Try API
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies using our AI-powered platform to find and hire the best talent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
