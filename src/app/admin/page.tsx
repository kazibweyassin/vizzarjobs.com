"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Building2, Contact, FileText, User, TrendingUp, DollarSign, Globe, Users } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get data from API
  const { data: jobsData } = api.jobs.getCount.useQuery();
  const { data: usersData } = api.users.getCount.useQuery();
  const { data: companiesData } = api.companies.getCount.useQuery();
  const { data: contactRequestsData } = api.contactRequests.getCount.useQuery();
  
  // Get verification data
  const { data: pendingCompanyVerifications } = api.companies.getPendingVerifications.useQuery({
    status: "PENDING"
  });
  
  const { data: pendingUserVerifications } = api.users.getPendingVerifications.useQuery({
    status: "PENDING"
  });
  
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome, {session?.user?.name || "Admin"}</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin/jobs">Manage Jobs</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/contact-requests">Review Requests</Link>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-blue-50 dark:bg-blue-950 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{jobsData?.count || '0'}</div>
                <p className="text-xs text-gray-500 mt-1">Across {jobsData?.companies || '0'} companies</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <User className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersData?.count || '0'}</div>
                <p className="text-xs text-gray-500 mt-1">{usersData?.newThisWeek || '0'} new this week</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-500">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(pendingCompanyVerifications?.length || 0) + (pendingUserVerifications?.length || 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  <Link href="/admin/verification" className="text-blue-500 hover:underline">Review now</Link>
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Companies</CardTitle>
                <Building2 className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companiesData?.count || '0'}</div>
                <p className="text-xs text-gray-500 mt-1">{companiesData?.verified || '0'} verified companies</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Contact Requests</CardTitle>
                <Contact className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contactRequestsData?.count || '0'}</div>
                <p className="text-xs text-gray-500 mt-1">{contactRequestsData?.pending || '0'} pending review</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M9 12l2 2 4-4"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Verify Companies & Users</h3>
                  <p className="text-gray-500 text-sm mb-4">Review and approve pending verification requests</p>
                  <Button asChild className="w-full">
                    <Link href="/admin/verification">Go to Verification</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                    <Contact className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Review Contact Requests</h3>
                  <p className="text-gray-500 text-sm mb-4">Process incoming company registration requests</p>
                  <Button asChild className="w-full">
                    <Link href="/admin/contact-requests">Manage Requests</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Create Company & Job</h3>
                  <p className="text-gray-500 text-sm mb-4">Streamlined form to create both company and job in one go</p>
                  <Button asChild className="w-full">
                    <Link href="/admin/create-job-with-company">Create Both</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Manage Companies</h3>
                  <p className="text-gray-500 text-sm mb-4">View and update all registered companies</p>
                  <Button asChild className="w-full">
                    <Link href="/admin/companies">View Companies</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7,10 12,15 17,10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Import Jobs</h3>
                  <p className="text-gray-500 text-sm mb-4">Copy and paste jobs from other job boards</p>
                  <Button asChild className="w-full">
                    <Link href="/admin/import-jobs">Import Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">New job posted</h3>
                      <p className="text-sm text-gray-500">Google posted "Senior Software Engineer"</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">New user registration</h3>
                      <p className="text-sm text-gray-500">John Doe joined the platform</p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-amber-100 rounded-full p-2">
                      <Contact className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">New contact request</h3>
                      <p className="text-sm text-gray-500">Amazon is interested in posting jobs</p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/create-job">
                      <FileText className="mr-2 h-4 w-4" />
                      Add New Job
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/create-job-with-company">
                      <Building2 className="mr-2 h-4 w-4" />
                      Create Company & Job
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/import-jobs">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Import Jobs
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/create-company">
                      <Building2 className="mr-2 h-4 w-4" />
                      Add New Company
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/contact-requests">
                      <Contact className="mr-2 h-4 w-4" />
                      Review Contact Requests
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" variant="outline">
                    <Link href="/admin/verification">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Strategy</CardTitle>
                <CardDescription>Key metrics and targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">User Acquisition</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Target: 1,000 users by end of month</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Job Listings</span>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Target: 500 jobs by end of quarter</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Corporate Partners</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Target: 50 partners by end of year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Marketing Channels</CardTitle>
                <CardDescription>Performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">LinkedIn</h3>
                        <p className="text-xs text-gray-500">Social Media</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">452</p>
                      <p className="text-xs text-green-600">+12%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-md mr-3">
                        <Globe className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Google</h3>
                        <p className="text-xs text-gray-500">Search</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">328</p>
                      <p className="text-xs text-green-600">+8%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-md mr-3">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Referrals</h3>
                        <p className="text-xs text-gray-500">Word of mouth</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">156</p>
                      <p className="text-xs text-green-600">+22%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Streams</CardTitle>
              <CardDescription>Current and potential income sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                    Premium Job Listings
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Companies pay to highlight their job postings. Recommended price: $99-$299 per listing.
                  </p>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span>Current Revenue</span>
                    <span className="font-bold">$0</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                    Subscription Plans
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Employers pay monthly fee for multiple job postings. Recommended: $199-$499/month.
                  </p>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span>Current Revenue</span>
                    <span className="font-bold">$0</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-amber-600" />
                    Featured Company Profiles
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Companies pay for enhanced profiles and branding. Recommended: $299-$999/month.
                  </p>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span>Current Revenue</span>
                    <span className="font-bold">$0</span>
                  </div>
                </div>
                
                <Button className="w-full">Set Up Payment Processing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}