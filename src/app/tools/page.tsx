"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { 
  FileText, 
  Code, 
  Palette, 
  Type, 
  Image, 
  Link as LinkIcon,
  Zap,
  Star,
  ArrowRight
} from 'lucide-react';

const tools = [
  {
    title: 'Rich Text Editor',
    description: 'Professional text editor with formatting, media, and HTML export capabilities',
    href: '/tools/rich-text-editor',
    icon: FileText,
    features: ['Bold, Italic, Underline', 'Headings & Lists', 'Images & Links', 'HTML Export'],
    color: 'blue',
    popular: true
  },
  {
    title: 'Resume Analyzer',
    description: 'AI-powered resume analysis with ATS compatibility scoring and skills gap analysis',
    href: '/tools/resume-analyzer',
    icon: Code,
    features: ['ATS Compatibility', 'Skills Analysis', 'Keyword Optimization', 'Gap Analysis'],
    color: 'green',
    comingSoon: true
  },
  {
    title: 'Job Description Generator',
    description: 'Create professional job descriptions with AI assistance and best practices',
    href: '/tools/job-description-generator',
    icon: Type,
    features: ['AI Generation', 'Best Practices', 'Templates', 'Customization'],
    color: 'purple',
    comingSoon: true
  },
  {
    title: 'Company Profile Builder',
    description: 'Build compelling company profiles with rich media and culture insights',
    href: '/tools/company-profile-builder',
    icon: Image,
    features: ['Rich Media', 'Culture Insights', 'Team Photos', 'Brand Guidelines'],
    color: 'orange',
    comingSoon: true
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200'
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Tools Suite
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Enhance your job search and career development with our AI-powered tools designed for tech professionals
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Star className="w-4 h-4 mr-1" />
              Professional Grade
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Code className="w-4 h-4 mr-1" />
              Developer Friendly
            </Badge>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            const colorClasses = getColorClasses(tool.color);
            
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${colorClasses}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-blue-700 transition-colors">
                          {tool.title}
                        </CardTitle>
                        {tool.popular && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs mt-1">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {tool.comingSoon && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs mt-1">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Key Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {tool.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100">
                      {tool.comingSoon ? (
                        <div className="flex items-center justify-center py-3 text-gray-500">
                          <span className="text-sm">Coming Soon</span>
                        </div>
                      ) : (
                        <Link href={tool.href}>
                          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group">
                            <span className="font-medium">Try Now</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Why Choose Our Tools?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Intelligence</h4>
                  <p className="text-sm text-gray-600">Our tools use advanced AI to provide insights and recommendations that help you succeed.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Quality</h4>
                  <p className="text-sm text-gray-600">Designed for professionals who need high-quality results and polished presentations.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Easy Integration</h4>
                  <p className="text-sm text-gray-600">Seamlessly integrate with your existing workflow and export in multiple formats.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Continuous Updates</h4>
                  <p className="text-sm text-gray-600">Regular updates with new features and improvements based on user feedback.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Ready to enhance your professional toolkit? Start with our most popular tool.
              </p>
              <Link href="/tools/rich-text-editor">
                <div className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-center font-medium">
                  Try Rich Text Editor
                </div>
              </Link>
              <div className="text-xs text-gray-500 text-center">
                No account required • Free to use
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
