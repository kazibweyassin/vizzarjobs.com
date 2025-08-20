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
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Add New Job
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="mr-2 h-4 w-4" />
                    Add New Company
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Contact className="mr-2 h-4 w-4" />
                    Review Contact Requests
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
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