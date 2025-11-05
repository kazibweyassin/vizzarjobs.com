'use client';

import { Card, CardContent } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Badge } from '~/components/ui/badge';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { getATSRecommendations } from '~/lib/ats-scoring';
import type { ResumeData } from '~/types/resume';

interface ATSScoreCardProps {
  score: number;
  resumeData: ResumeData;
}

export function ATSScoreCard({ score, resumeData }: ATSScoreCardProps) {
  const recommendations = getATSRecommendations(resumeData);
  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${getScoreBgColor()} flex items-center justify-center`}>
              <span className={`text-2xl font-bold ${getScoreColor()}`}>
                {score}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">ATS Compatibility Score</h3>
              <p className="text-sm text-gray-600">
                {getScoreLabel()} • Optimized for Applicant Tracking Systems
              </p>
            </div>
          </div>
          <Badge variant={score >= 80 ? 'default' : 'secondary'} className="text-sm">
            <TrendingUp className="w-3 h-3 mr-1" />
            {score >= 80 ? 'ATS Ready' : 'Improve Score'}
          </Badge>
        </div>

        <Progress value={score} className="mb-4" />

        {recommendations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-gray-900">Recommendations</span>
            </div>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {score >= 80 && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Your resume is well-optimized for ATS systems!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

