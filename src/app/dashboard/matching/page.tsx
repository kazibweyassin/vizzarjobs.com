"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { MatchedCandidates } from "~/components/MatchedCandidates";
import { MatchedJobs } from "~/components/MatchedJobs";
import { useSession } from "next-auth/react";

export default function MatchingDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("matches");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Get user's jobs if they're an employer
  const { data: userJobs } = api.jobs.getUserJobs.useQuery(undefined, {
    enabled: session?.user.role === "EMPLOYER" || session?.user.role === "ADMIN",
  });

  // Get user's matching preferences
  const { data: matchingPreferences } = api.matching.getUserMatchingPreferences.useQuery();

  // Check if user has set up their matching preferences
  const hasSetupPreferences = !!matchingPreferences && 
    matchingPreferences.skills.length > 0 && 
    matchingPreferences.jobRoles.length > 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Matching Dashboard</h1>
      
      {!hasSetupPreferences && (
        <Card className="mb-6 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Complete Your Matching Profile</h3>
                <p className="text-yellow-700">
                  Set up your matching preferences to get personalized job recommendations.
                </p>
              </div>
              <Button asChild>
                <a href="/profile/matching">Set Up Preferences</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Matching Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {session?.user.role === "EMPLOYER" || session?.user.role === "ADMIN" ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Active Jobs</p>
                    <p className="text-2xl font-bold">{userJobs?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Candidates Matched</p>
                    <p className="text-2xl font-bold">
                      {userJobs?.reduce((acc, job) => acc + (job._count?.applications || 0), 0) || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Match Quality</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Job Matches</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Top Match Score</p>
                    <p className="text-2xl font-bold">92%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">New Matches (7d)</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                </>
              )}
              
              <div className="pt-2">
                <Button variant="outline" asChild className="w-full">
                  <a href="/profile/matching">
                    {hasSetupPreferences ? 'Update Preferences' : 'Set Up Preferences'}
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {session?.user.role === "EMPLOYER" || session?.user.role === "ADMIN" 
                  ? "Matched Candidates" 
                  : "Matched Jobs"}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {!hasSetupPreferences ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-700">No Matches Yet</h3>
                  <p className="text-gray-500 mt-1">
                    Complete your matching preferences to see personalized matches.
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/profile/matching">Set Up Preferences</a>
                  </Button>
                </div>
              ) : session?.user.role === "EMPLOYER" || session?.user.role === "ADMIN" ? (
                <div>
                  {/* Job selection for employers */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select a job to view matched candidates:
                    </label>
                    <select 
                      className="w-full border border-gray-300 rounded-md py-2 px-3"
                      value={selectedJobId || ''}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                    >
                      <option value="">Select a job</option>
                      {userJobs?.map(job => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedJobId ? (
                    <MatchedCandidates jobId={selectedJobId} />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Select a job to view matched candidates
                    </div>
                  )}
                </div>
              ) : (
                <MatchedJobs />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
