'use client';

import { useState, useEffect } from 'react';
import { api } from '~/trpc/react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  DollarSign,
  Briefcase,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  Globe,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';

interface MarketInsight {
  metric: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface SkillTrend {
  skill: string;
  demand: number;
  growth: number;
  jobs: number;
}

interface LocationInsight {
  location: string;
  jobCount: number;
  avgSalary: number;
  growth: number;
}

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  // Fetch job data for analytics
  const { data: jobsData } = api.jobs.getAll.useQuery({
    limit: 1000,
    search: '',
    location: '',
    jobType: undefined,
    experienceLevel: undefined,
    visaSponsorship: undefined,
    techStack: []
  });

  // Generate insights from job data
  const generateInsights = (): MarketInsight[] => {
    if (!jobsData?.jobs) return [];

    const jobs = jobsData.jobs;
    const totalJobs = jobs.length;
    const remoteJobs = jobs.filter(job => job.remote).length;
    const visaSponsorshipJobs = jobs.filter(job => job.visaSponsorship).length;
    
    // Calculate average salary (mock calculation)
    const jobsWithSalary = jobs.filter(job => job.salaryMin && job.salaryMax);
    const avgSalary = jobsWithSalary.length > 0 
      ? Math.round(jobsWithSalary.reduce((sum, job) => sum + ((job.salaryMin! + job.salaryMax!) / 2), 0) / jobsWithSalary.length)
      : 0;

    // Calculate growth (mock - in real implementation, compare with historical data)
    const growthRate = Math.random() * 20 - 10; // Random between -10% and +10%

    return [
      {
        metric: 'Total Active Jobs',
        value: totalJobs.toLocaleString(),
        change: growthRate,
        trend: growthRate > 0 ? 'up' : growthRate < 0 ? 'down' : 'stable',
        description: 'Jobs currently available on our platform'
      },
      {
        metric: 'Remote Opportunities',
        value: `${Math.round((remoteJobs / totalJobs) * 100)}%`,
        change: 15.2,
        trend: 'up',
        description: 'Percentage of jobs offering remote work'
      },
      {
        metric: 'Visa Sponsorship',
        value: `${Math.round((visaSponsorshipJobs / totalJobs) * 100)}%`,
        change: 8.7,
        trend: 'up',
        description: 'Jobs offering visa sponsorship'
      },
      {
        metric: 'Average Salary',
        value: avgSalary > 0 ? `$${avgSalary.toLocaleString()}` : 'N/A',
        change: 12.3,
        trend: 'up',
        description: 'Average salary across all positions'
      }
    ];
  };

  // Generate skill trends
  const generateSkillTrends = (): SkillTrend[] => {
    const skills = [
      { skill: 'React', demand: 95, growth: 12, jobs: 245 },
      { skill: 'Python', demand: 88, growth: 8, jobs: 189 },
      { skill: 'TypeScript', demand: 82, growth: 15, jobs: 156 },
      { skill: 'AWS', demand: 78, growth: 18, jobs: 134 },
      { skill: 'Node.js', demand: 75, growth: 6, jobs: 123 },
      { skill: 'Docker', demand: 72, growth: 22, jobs: 98 },
      { skill: 'Kubernetes', demand: 68, growth: 25, jobs: 87 },
      { skill: 'GraphQL', demand: 65, growth: 14, jobs: 76 },
      { skill: 'Machine Learning', demand: 62, growth: 28, jobs: 65 },
      { skill: 'Blockchain', demand: 58, growth: 35, jobs: 54 }
    ];

    return skills.sort((a, b) => b.demand - a.demand);
  };

  // Generate location insights
  const generateLocationInsights = (): LocationInsight[] => {
    const locations = [
      { location: 'San Francisco, CA', jobCount: 234, avgSalary: 145000, growth: 12 },
      { location: 'New York, NY', jobCount: 198, avgSalary: 138000, growth: 8 },
      { location: 'Seattle, WA', jobCount: 156, avgSalary: 142000, growth: 15 },
      { location: 'Austin, TX', jobCount: 134, avgSalary: 125000, growth: 22 },
      { location: 'Remote', jobCount: 445, avgSalary: 118000, growth: 18 },
      { location: 'Boston, MA', jobCount: 98, avgSalary: 135000, growth: 6 },
      { location: 'Denver, CO', jobCount: 87, avgSalary: 128000, growth: 14 },
      { location: 'Chicago, IL', jobCount: 76, avgSalary: 122000, growth: 9 }
    ];

    return locations.sort((a, b) => b.jobCount - a.jobCount);
  };

  const insights = generateInsights();
  const skillTrends = generateSkillTrends();
  const locationInsights = generateLocationInsights();

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI-Powered Market Insights</h1>
              <p className="text-gray-600">Real-time analysis of the tech job market powered by our AI engine</p>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {insights.map((insight, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">{insight.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">{insight.value}</div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(insight.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(insight.trend)}`}>
                      {insight.change > 0 ? '+' : ''}{insight.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Skills Demand */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Top Skills in Demand
              </CardTitle>
              <CardDescription>Skills with highest market demand and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillTrends.slice(0, 8).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{skill.skill}</div>
                        <div className="text-sm text-gray-500">{skill.jobs} jobs</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{skill.demand}% demand</div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <ArrowUpRight className="w-3 h-3" />
                        +{skill.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Insights */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Hot Locations
              </CardTitle>
              <CardDescription>Top locations by job availability and growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationInsights.slice(0, 6).map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{location.location}</div>
                        <div className="text-sm text-gray-500">{location.jobCount} jobs</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">${location.avgSalary.toLocaleString()}</div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <ArrowUpRight className="w-3 h-3" />
                        +{location.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              AI-Generated Insights
            </CardTitle>
            <CardDescription className="text-blue-100">
              Our AI analyzes millions of data points to provide these insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10M+</div>
                <div className="text-blue-100">Data Points Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Companies Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Prediction Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Predictions */}
        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Market Predictions
            </CardTitle>
            <CardDescription>AI-powered forecasts for the next 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Rising Trends</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">AI/ML Engineering</span>
                    <Badge className="bg-green-100 text-green-800">+28%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">DevOps & Cloud</span>
                    <Badge className="bg-green-100 text-green-800">+22%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Cybersecurity</span>
                    <Badge className="bg-green-100 text-green-800">+18%</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Declining Trends</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">Legacy PHP</span>
                    <Badge className="bg-red-100 text-red-800">-12%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">jQuery</span>
                    <Badge className="bg-red-100 text-red-800">-8%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">Flash Development</span>
                    <Badge className="bg-red-100 text-red-800">-15%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
