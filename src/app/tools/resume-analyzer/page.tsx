'use client';

import { useState, useRef } from 'react';
import { api } from '~/trpc/react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  Download,
  Copy,
  Star,
  Zap,
  Brain,
  BarChart3,
  Award,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

interface ResumeAnalysis {
  atsScore: number;
  skillsMatch: string[];
  skillsGap: string[];
  recommendations: string[];
  keywordDensity: Record<string, number>;
  experienceLevel: string;
  jobTypeMatch: string[];
  strengths: string[];
  improvements: string[];
}

interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  matchScore: number;
  reasons: string[];
}

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch jobs for matching
  const { data: jobsData } = api.jobs.getAll.useQuery({
    limit: 100,
    search: '',
    location: '',
    jobType: undefined,
    experienceLevel: undefined,
    visaSponsorship: undefined,
    techStack: []
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis (in real implementation, this would call an AI service)
    setTimeout(() => {
      const mockAnalysis: ResumeAnalysis = {
        atsScore: Math.floor(Math.random() * 30) + 70, // 70-100
        skillsMatch: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
        skillsGap: ['Kubernetes', 'GraphQL', 'Machine Learning', 'Redis'],
        recommendations: [
          'Add more specific metrics and quantifiable achievements',
          'Include relevant certifications (AWS, Google Cloud)',
          'Optimize keyword density for ATS systems',
          'Add a professional summary section'
        ],
        keywordDensity: {
          'JavaScript': 12,
          'React': 8,
          'Node.js': 6,
          'AWS': 4,
          'Docker': 3
        },
        experienceLevel: 'Senior',
        jobTypeMatch: ['FULL_TIME', 'CONTRACT'],
        strengths: [
          'Strong technical skills in modern web development',
          'Experience with cloud platforms',
          'Good project management experience'
        ],
        improvements: [
          'Add more leadership experience',
          'Include specific project outcomes',
          'Mention team size and budget responsibilities'
        ]
      };

      // Generate job matches
      const mockJobMatches: JobMatch[] = jobsData?.jobs?.slice(0, 5).map((job, index) => ({
        jobId: job.id,
        title: job.title,
        company: typeof job.company === 'string' ? job.company : job.company?.name || 'Unknown',
        matchScore: Math.floor(Math.random() * 20) + 80, // 80-100
        reasons: [
          'Skills alignment: 95%',
          'Experience level match',
          'Location compatibility'
        ]
      })) || [];

      setAnalysis(mockAnalysis);
      setJobMatches(mockJobMatches);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
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
              <h1 className="text-3xl font-bold text-gray-900">AI Resume Analyzer</h1>
              <p className="text-gray-600">Get instant feedback on your resume with AI-powered analysis</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Upload Resume
                </CardTitle>
                <CardDescription>Upload your resume or paste the text below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    Choose File
                  </Button>
                </div>

                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or paste your resume text:
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content here..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <Button
                  onClick={analyzeResume}
                  disabled={!resumeText.trim() || isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {!analysis ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-600">Upload your resume or paste the text to get started with AI-powered analysis.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* ATS Score */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      ATS Compatibility Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-20 h-20 rounded-full ${getScoreBgColor(analysis.atsScore)} flex items-center justify-center`}>
                          <span className={`text-2xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                            {analysis.atsScore}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">ATS Score</h3>
                          <p className="text-sm text-gray-600">
                            {analysis.atsScore >= 90 ? 'Excellent' : 
                             analysis.atsScore >= 80 ? 'Good' : 
                             analysis.atsScore >= 70 ? 'Fair' : 'Needs Improvement'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Compatibility</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {analysis.atsScore >= 90 ? '95%' : 
                           analysis.atsScore >= 80 ? '85%' : 
                           analysis.atsScore >= 70 ? '75%' : '65%'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Skills Match
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.skillsMatch.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" />
                        Skills Gap
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.skillsGap.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Job Matches */}
                {jobMatches.length > 0 && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-600" />
                        Top Job Matches
                      </CardTitle>
                      <CardDescription>Jobs that match your profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {jobMatches.map((match, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{match.title}</h4>
                              <p className="text-sm text-gray-600">{match.company}</p>
                              <div className="flex gap-2 mt-2">
                                {match.reasons.map((reason, reasonIndex) => (
                                  <Badge key={reasonIndex} variant="secondary" className="text-xs">
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">{match.matchScore}%</div>
                              <div className="text-xs text-gray-500">Match</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
