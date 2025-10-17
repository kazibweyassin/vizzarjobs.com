'use client';

import Link from 'next/link';
import {
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Clock,
  Star,
  ArrowRight,
  Play,
  Download,
  Calendar,
  Target,
  Lightbulb,
  Briefcase,
  DollarSign,
  Globe,
  Zap,
  Brain,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'report' | 'course' | 'tool' | 'article';
  category: string;
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads?: number;
  isNew?: boolean;
  isPremium?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  completionRate: number;
}

export default function ResourcesPage() {
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Complete Guide to Tech Salary Negotiation',
      description: 'Master the art of negotiating your tech salary with data-driven strategies and real-world examples.',
      type: 'guide',
      category: 'Career Development',
      readTime: '15 min',
      difficulty: 'intermediate',
      rating: 4.8,
      downloads: 2847,
      isNew: true
    },
    {
      id: '2',
      title: '2024 Tech Job Market Report',
      description: 'Comprehensive analysis of hiring trends, salary data, and emerging technologies in the tech industry.',
      type: 'report',
      category: 'Market Research',
      readTime: '25 min',
      difficulty: 'beginner',
      rating: 4.9,
      downloads: 1923,
      isPremium: true
    },
    {
      id: '3',
      title: 'AI Interview Preparation Course',
      description: 'Prepare for AI/ML engineering interviews with mock questions, coding challenges, and expert tips.',
      type: 'course',
      category: 'Interview Prep',
      readTime: '2 hours',
      difficulty: 'advanced',
      rating: 4.7,
      downloads: 1456
    },
    {
      id: '4',
      title: 'Remote Work Success Toolkit',
      description: 'Essential tools, strategies, and best practices for thriving in remote tech roles.',
      type: 'tool',
      category: 'Remote Work',
      readTime: '20 min',
      difficulty: 'beginner',
      rating: 4.6,
      downloads: 3214
    },
    {
      id: '5',
      title: 'Tech Stack Comparison Guide',
      description: 'Compare popular technologies: React vs Vue, Node.js vs Python, AWS vs Azure, and more.',
      type: 'guide',
      category: 'Technology',
      readTime: '30 min',
      difficulty: 'intermediate',
      rating: 4.5,
      downloads: 2789
    },
    {
      id: '6',
      title: 'Startup vs Big Tech: Career Analysis',
      description: 'Detailed comparison of working at startups versus large tech companies, including pros and cons.',
      type: 'article',
      category: 'Career Development',
      readTime: '12 min',
      difficulty: 'beginner',
      rating: 4.4,
      downloads: 1654
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: '1',
      title: 'Full-Stack Developer Path',
      description: 'Complete journey from beginner to full-stack developer with modern technologies.',
      duration: '6 months',
      modules: 24,
      difficulty: 'intermediate',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      completionRate: 78
    },
    {
      id: '2',
      title: 'AI/ML Engineer Track',
      description: 'Master machine learning and artificial intelligence with hands-on projects.',
      duration: '8 months',
      modules: 32,
      difficulty: 'advanced',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Data Science'],
      completionRate: 65
    },
    {
      id: '3',
      title: 'DevOps & Cloud Specialist',
      description: 'Learn cloud infrastructure, CI/CD, and modern DevOps practices.',
      duration: '4 months',
      modules: 18,
      difficulty: 'intermediate',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Monitoring'],
      completionRate: 82
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-4 h-4" />;
      case 'report': return <TrendingUp className="w-4 h-4" />;
      case 'course': return <Play className="w-4 h-4" />;
      case 'tool': return <Target className="w-4 h-4" />;
      case 'article': return <Lightbulb className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'report': return 'bg-green-100 text-green-800';
      case 'course': return 'bg-purple-100 text-purple-800';
      case 'tool': return 'bg-orange-100 text-orange-800';
      case 'article': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tech Resources & Learning Hub</h1>
              <p className="text-gray-600">Master your tech career with expert guides, courses, and insights</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Resources</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Learners</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Learning Paths */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Learning Paths</h2>
            <Link href="/resources/paths" className="text-blue-600 hover:text-blue-700 font-medium">
              View All <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(path.difficulty)}>
                      {path.difficulty}
                    </Badge>
                    <div className="text-sm text-gray-500">{path.completionRate}% complete</div>
                  </div>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {path.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {path.modules} modules
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {path.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {path.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{path.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      Start Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Resources</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="outline" size="sm">Guides</Button>
              <Button variant="outline" size="sm">Reports</Button>
              <Button variant="outline" size="sm">Courses</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getTypeColor(resource.type)}>
                      {getTypeIcon(resource.type)}
                      <span className="ml-1 capitalize">{resource.type}</span>
                    </Badge>
                    <div className="flex gap-1">
                      {resource.isNew && (
                        <Badge className="bg-green-100 text-green-800">New</Badge>
                      )}
                      {resource.isPremium && (
                        <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {resource.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {resource.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(resource.difficulty)}>
                        {resource.difficulty}
                      </Badge>
                      {resource.downloads && (
                        <div className="text-sm text-gray-500">
                          {resource.downloads.toLocaleString()} downloads
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        Read More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI-Powered Features */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI-Powered Learning
            </CardTitle>
            <CardDescription className="text-blue-100">
              Personalized learning experiences powered by artificial intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Smart Recommendations</h3>
                <p className="text-sm text-blue-100">Get personalized resource suggestions based on your career goals</p>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Adaptive Learning</h3>
                <p className="text-sm text-blue-100">Learning paths that adapt to your pace and skill level</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Progress Tracking</h3>
                <p className="text-sm text-blue-100">AI-powered insights into your learning progress and achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
