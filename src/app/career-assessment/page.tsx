"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { Badge } from '~/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Award, 
  MapPin, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface AssessmentResult {
  overallScore: number;
  skillScores: {
    technical: number;
    soft: number;
    leadership: number;
    communication: number;
  };
  marketFit: {
    score: number;
    demand: 'High' | 'Medium' | 'Low';
    growth: 'Growing' | 'Stable' | 'Declining';
  };
  recommendations: {
    skills: string[];
    certifications: string[];
    careerPaths: string[];
  };
  salaryInsights: {
    current: number;
    potential: number;
    premium: number;
  };
}

export default function CareerAssessmentTool() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const questions = [
    {
      id: 'experience',
      question: 'How many years of professional experience do you have?',
      type: 'range',
      options: { min: 0, max: 20, step: 1 },
      weight: 0.2
    },
    {
      id: 'skills',
      question: 'Which technical skills do you have? (Select all that apply)',
      type: 'multi-select',
      options: [
        'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker',
        'Machine Learning', 'Data Science', 'DevOps', 'Mobile Development',
        'Blockchain', 'Cybersecurity', 'Cloud Computing', 'AI/ML'
      ],
      weight: 0.3
    },
    {
      id: 'education',
      question: 'What is your highest level of education?',
      type: 'select',
      options: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Certification'],
      weight: 0.1
    },
    {
      id: 'location',
      question: 'Where are you currently located?',
      type: 'select',
      options: ['Uganda', 'Kenya', 'Nigeria', 'South Africa', 'Other African Country', 'Outside Africa'],
      weight: 0.1
    },
    {
      id: 'goals',
      question: 'What are your primary career goals?',
      type: 'multi-select',
      options: ['Remote Work', 'Visa Sponsorship', 'Higher Salary', 'Leadership Role', 'Startup Experience', 'Big Tech'],
      weight: 0.2
    },
    {
      id: 'preferences',
      question: 'What type of work environment do you prefer?',
      type: 'select',
      options: ['Remote', 'Hybrid', 'Office', 'Flexible'],
      weight: 0.1
    }
  ];

  const calculateScore = (answers: Record<string, any>): AssessmentResult => {
    let totalScore = 0;
    
    // Experience scoring (0-100)
    const experienceScore = Math.min(answers.experience * 5, 100);
    totalScore += experienceScore * 0.2;
    
    // Skills scoring (0-100)
    const skillCount = answers.skills?.length || 0;
    const skillsScore = Math.min(skillCount * 7, 100);
    totalScore += skillsScore * 0.3;
    
    // Education scoring (0-100)
    const educationMap = { 'High School': 20, 'Associate': 40, 'Bachelor': 60, 'Master': 80, 'PhD': 100, 'Certification': 50 };
    const educationScore = educationMap[answers.education as keyof typeof educationMap] || 0;
    totalScore += educationScore * 0.1;
    
    // Location scoring (0-100) - African countries get bonus
    const locationMap = { 'Uganda': 90, 'Kenya': 85, 'Nigeria': 80, 'South Africa': 75, 'Other African Country': 70, 'Outside Africa': 60 };
    const locationScore = locationMap[answers.location as keyof typeof locationMap] || 0;
    totalScore += locationScore * 0.1;
    
    // Goals scoring (0-100)
    const goalCount = answers.goals?.length || 0;
    const goalsScore = Math.min(goalCount * 20, 100);
    totalScore += goalsScore * 0.2;
    
    // Preferences scoring (0-100)
    const preferenceMap = { 'Remote': 100, 'Hybrid': 80, 'Office': 60, 'Flexible': 90 };
    const preferenceScore = preferenceMap[answers.preferences as keyof typeof preferenceMap] || 0;
    totalScore += preferenceScore * 0.1;

    // Calculate skill breakdown
    const technicalSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Machine Learning', 'Data Science', 'DevOps', 'Mobile Development', 'Blockchain', 'Cybersecurity', 'Cloud Computing', 'AI/ML'];
    const technicalCount = answers.skills?.filter((skill: string) => technicalSkills.includes(skill)).length || 0;
    
    return {
      overallScore: Math.round(totalScore),
      skillScores: {
        technical: Math.min(technicalCount * 15, 100),
        soft: Math.min(answers.goals?.length * 20, 100),
        leadership: answers.goals?.includes('Leadership Role') ? 80 : 40,
        communication: answers.education === 'Master' || answers.education === 'PhD' ? 90 : 70
      },
      marketFit: {
        score: Math.round(totalScore * 0.8),
        demand: totalScore > 80 ? 'High' : totalScore > 60 ? 'Medium' : 'Low',
        growth: answers.skills?.includes('AI/ML') || answers.skills?.includes('Machine Learning') ? 'Growing' : 'Stable'
      },
      recommendations: {
        skills: getSkillRecommendations(answers.skills || []),
        certifications: getCertificationRecommendations(answers.skills || []),
        careerPaths: getCareerPathRecommendations(answers)
      },
      salaryInsights: {
        current: calculateCurrentSalary(answers),
        potential: calculatePotentialSalary(answers),
        premium: calculateVisaPremium(answers)
      }
    };
  };

  const getSkillRecommendations = (currentSkills: string[]): string[] => {
    const skillMap: Record<string, string[]> = {
      'JavaScript': ['TypeScript', 'React', 'Node.js'],
      'Python': ['Django', 'Flask', 'Data Science'],
      'AWS': ['Docker', 'Kubernetes', 'Terraform'],
      'React': ['Next.js', 'GraphQL', 'Testing'],
      'Machine Learning': ['TensorFlow', 'PyTorch', 'MLOps']
    };
    
    const recommendations: string[] = [];
    currentSkills.forEach(skill => {
      if (skillMap[skill]) {
        recommendations.push(...skillMap[skill]);
      }
    });
    
    return [...new Set(recommendations)].slice(0, 5);
  };

  const getCertificationRecommendations = (skills: string[]): string[] => {
    const certMap: Record<string, string[]> = {
      'AWS': ['AWS Solutions Architect', 'AWS Developer'],
      'JavaScript': ['Google Cloud Professional Developer'],
      'Python': ['Google Data Analytics', 'Microsoft Azure Data Scientist'],
      'Machine Learning': ['Google Machine Learning Engineer', 'AWS Machine Learning']
    };
    
    const recommendations: string[] = [];
    skills.forEach(skill => {
      if (certMap[skill]) {
        recommendations.push(...certMap[skill]);
      }
    });
    
    return [...new Set(recommendations)].slice(0, 3);
  };

  const getCareerPathRecommendations = (answers: Record<string, any>): string[] => {
    const paths = [];
    
    if (answers.skills?.includes('Machine Learning')) {
      paths.push('AI/ML Engineer');
    }
    if (answers.skills?.includes('React')) {
      paths.push('Frontend Developer');
    }
    if (answers.skills?.includes('AWS')) {
      paths.push('DevOps Engineer');
    }
    if (answers.goals?.includes('Leadership Role')) {
      paths.push('Tech Lead');
    }
    if (answers.goals?.includes('Startup Experience')) {
      paths.push('Startup CTO');
    }
    
    return paths.length > 0 ? paths : ['Full Stack Developer', 'Software Engineer', 'Tech Consultant'];
  };

  const calculateCurrentSalary = (answers: Record<string, any>): number => {
    let baseSalary = 30000; // USD base
    
    // Experience multiplier
    baseSalary += (answers.experience || 0) * 5000;
    
    // Education bonus
    const educationBonus = { 'Bachelor': 10000, 'Master': 20000, 'PhD': 30000 };
    baseSalary += educationBonus[answers.education as keyof typeof educationBonus] || 0;
    
    // Skills bonus
    const skillCount = answers.skills?.length || 0;
    baseSalary += skillCount * 2000;
    
    return Math.round(baseSalary);
  };

  const calculatePotentialSalary = (answers: Record<string, any>): number => {
    const current = calculateCurrentSalary(answers);
    return Math.round(current * 1.5); // 50% increase potential
  };

  const calculateVisaPremium = (answers: Record<string, any>): number => {
    const current = calculateCurrentSalary(answers);
    return Math.round(current * 0.3); // 30% visa sponsorship premium
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const assessmentResult = calculateScore(answers);
      setResult(assessmentResult);
      setIsComplete(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setIsComplete(false);
  };

  if (isComplete && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-opal-2 to-opal-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-kale mb-2">Your Career Assessment Results</h1>
            <p className="text-lg text-grey-green">Discover your potential and next steps</p>
          </div>

          {/* Overall Score */}
          <Card className="mb-8 shadow-xl border-light-green">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-kale flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-emerald" />
                Overall Career Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-emerald mb-4">{result.overallScore}/100</div>
                <Progress value={result.overallScore} className="h-4 mb-4" />
                <p className="text-lg text-grey-green">
                  {result.overallScore >= 80 ? 'Excellent! You\'re well-positioned for global opportunities.' :
                   result.overallScore >= 60 ? 'Good! You have solid foundations with room for growth.' :
                   'Great potential! Focus on skill development and experience building.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Skill Breakdown */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-kale flex items-center gap-2">
                  <Brain className="h-5 w-5 text-emerald" />
                  Skill Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Technical Skills</span>
                    <span className="text-sm text-emerald">{result.skillScores.technical}/100</span>
                  </div>
                  <Progress value={result.skillScores.technical} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Soft Skills</span>
                    <span className="text-sm text-emerald">{result.skillScores.soft}/100</span>
                  </div>
                  <Progress value={result.skillScores.soft} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Leadership</span>
                    <span className="text-sm text-emerald">{result.skillScores.leadership}/100</span>
                  </div>
                  <Progress value={result.skillScores.leadership} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Communication</span>
                    <span className="text-sm text-emerald">{result.skillScores.communication}/100</span>
                  </div>
                  <Progress value={result.skillScores.communication} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Market Fit */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-kale flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald" />
                  Market Fit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald mb-2">{result.marketFit.score}/100</div>
                  <Badge className={`mb-2 ${
                    result.marketFit.demand === 'High' ? 'bg-green-100 text-green-800' :
                    result.marketFit.demand === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.marketFit.demand} Demand
                  </Badge>
                  <Badge className={`${
                    result.marketFit.growth === 'Growing' ? 'bg-blue-100 text-blue-800' :
                    result.marketFit.growth === 'Stable' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {result.marketFit.growth} Market
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Salary Insights */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-kale flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald" />
                Salary Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-kale mb-1">${result.salaryInsights.current.toLocaleString()}</div>
                  <p className="text-sm text-grey-green">Current Market Value</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald mb-1">${result.salaryInsights.potential.toLocaleString()}</div>
                  <p className="text-sm text-grey-green">Growth Potential</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-light-green mb-1">+${result.salaryInsights.premium.toLocaleString()}</div>
                  <p className="text-sm text-grey-green">Visa Sponsorship Premium</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-kale flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-kale mb-3">Skills to Learn</h4>
                  <div className="space-y-2">
                    {result.recommendations.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-kale mb-3">Certifications</h4>
                  <div className="space-y-2">
                    {result.recommendations.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-kale mb-3">Career Paths</h4>
                  <div className="space-y-2">
                    {result.recommendations.careerPaths.map((path, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {path}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="shadow-lg bg-gradient-to-r from-emerald to-light-green text-white">
            <CardContent className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Take Your Career Global?</h3>
              <p className="text-lg mb-6">Join our exclusive talent pool and get matched with visa-sponsored opportunities worldwide.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/talent-pool/register">
                  <Button size="lg" className="bg-white text-emerald hover:bg-gray-100">
                    <Zap className="mr-2 h-5 w-5" />
                    Join Talent Pool
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald" onClick={resetAssessment}>
                  <Star className="mr-2 h-5 w-5" />
                  Retake Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-opal-2 to-opal-1 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-kale mb-2">Career Assessment Tool</h1>
          <p className="text-lg text-grey-green">Discover your potential and get personalized career insights</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-grey-green mb-2">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2" />
        </div>

        <Card className="shadow-xl border-light-green">
          <CardHeader>
            <CardTitle className="text-xl text-kale">{currentQuestion.question}</CardTitle>
            <CardDescription>This helps us provide better career recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'range' && (
              <div>
                <input
                  type="range"
                  min={currentQuestion.options.min}
                  max={currentQuestion.options.max}
                  step={currentQuestion.options.step}
                  value={answers[currentQuestion.id] || currentQuestion.options.min}
                  onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-emerald font-semibold">
                  {answers[currentQuestion.id] || currentQuestion.options.min} years
                </div>
              </div>
            )}

            {currentQuestion.type === 'select' && (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option}
                    variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                  >
                    {answers[currentQuestion.id] === option && <CheckCircle className="mr-2 h-4 w-4" />}
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multi-select' && (
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option}
                    variant={answers[currentQuestion.id]?.includes(option) ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      const current = answers[currentQuestion.id] || [];
                      const updated = current.includes(option)
                        ? current.filter((item: string) => item !== option)
                        : [...current, option];
                      handleAnswer(currentQuestion.id, updated);
                    }}
                  >
                    {answers[currentQuestion.id]?.includes(option) && <CheckCircle className="mr-2 h-4 w-4" />}
                    {option}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                disabled={!answers[currentQuestion.id]}
              >
                {currentStep === questions.length - 1 ? 'Get Results' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
