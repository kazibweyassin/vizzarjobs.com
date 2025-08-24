"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import {
  BarChart3,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarClock,
  LineChart
} from "lucide-react";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("week");
  
  // Fetch company verification stats
  const { data: companyStats } = api.companies.getVerificationStats.useQuery();
  
  // Fetch user stats (to be implemented)
  const { data: userStats } = api.users.getVerifiedUsers.useQuery();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Verifications</p>
                <h3 className="text-2xl font-bold">
                  {companyStats?.pending || 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Verified Companies</p>
                <h3 className="text-2xl font-bold">
                  {companyStats?.approved || 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Verified Users</p>
                <h3 className="text-2xl font-bold">
                  {userStats || 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Rejected Applications</p>
                <h3 className="text-2xl font-bold">
                  {companyStats?.rejected || 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Verification Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Recent Verifications</h3>
                  <div className="flex space-x-1">
                    {["day", "week", "month", "year"].map((range) => (
                      <Button 
                        key={range}
                        variant={timeRange === range ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange(range as "day" | "week" | "month" | "year")}
                        className="text-xs h-8"
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Placeholder for verification activity chart */}
                <div className="h-[300px] bg-gray-50 rounded-md flex items-center justify-center border">
                  <LineChart className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-gray-500">Verification activity chart</span>
                </div>
                
                {/* Recent verification list */}
                <div>
                  <h3 className="font-medium mb-4">Latest Verification Requests</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">Acme Inc.</p>
                          <p className="text-sm text-gray-500">Technology • 50-100 employees</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-gray-500">Software Engineer • Berlin</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">TechGrowth Ltd</p>
                          <p className="text-sm text-gray-500">SaaS • 10-50 employees</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Need Info</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <a href="/admin/verification">View All Verification Requests</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" asChild>
                <a href="/admin/verification">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verify Companies
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/admin/verification?tab=users">
                  <Users className="mr-2 h-4 w-4" />
                  Verify Users
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/admin/jobs">
                  <Building className="mr-2 h-4 w-4" />
                  Manage Job Listings
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/admin/reports">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Verification Queue</span>
                    <span className="text-sm text-gray-500">
                      {companyStats?.pending || 0} pending
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, ((companyStats?.pending || 0) / (companyStats?.total || 1)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">System Load</span>
                    <span className="text-sm text-gray-500">Normal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: '35%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Storage Usage</span>
                    <span className="text-sm text-gray-500">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: '42%' }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-gray-500">Last system check: Today at 14:30</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
