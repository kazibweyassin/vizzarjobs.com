"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  User,
  FileSpreadsheet,
  BarChart3
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Get verification stats
  const { data: companyStats, isLoading: loadingCompanyStats } = api.companies.getVerificationStats.useQuery();
  const { data: verifiedUsers, isLoading: loadingUserStats } = api.users.getVerifiedUsers.useQuery();

  // Get recent companies
  const { data: recentCompanies } = api.companies.getPendingVerifications.useQuery({
    status: "PENDING"
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-xl mx-auto mb-8 grid grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="companies">
            <Building2 className="h-4 w-4 mr-2" />
            Companies
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Pending Companies</p>
                    <h3 className="text-2xl font-bold">
                      {loadingCompanyStats ? "..." : companyStats?.pending || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Verified Companies</p>
                    <h3 className="text-2xl font-bold">
                      {loadingCompanyStats ? "..." : companyStats?.approved || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Rejected Companies</p>
                    <h3 className="text-2xl font-bold">
                      {loadingCompanyStats ? "..." : companyStats?.rejected || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Verified Users</p>
                    <h3 className="text-2xl font-bold">
                      {loadingUserStats ? "..." : verifiedUsers || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Pending Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentCompanies && recentCompanies.length > 0 ? (
                    recentCompanies.slice(0, 5).map(company => (
                      <div key={company.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h4 className="font-medium">{company.name}</h4>
                          <div className="text-sm text-gray-500">{company.industry || "No industry"}</div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">No pending verifications</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <a href="/admin/verification">View All Verifications</a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href="/admin/verification">
                      <Building2 className="h-4 w-4 mr-2" />
                      Company Verification
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href="/admin/users">
                      <User className="h-4 w-4 mr-2" />
                      User Management
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href="/admin/contact-requests">
                      <Clock className="h-4 w-4 mr-2" />
                      Contact Requests
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full justify-start">
                    <a href="/admin/reports">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Generate Reports
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Companies Tab */}
        <TabsContent value="companies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Company Management</CardTitle>
              <Input placeholder="Search companies..." className="w-64" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button asChild>
                  <a href="/admin/verification">Go to Company Verification</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Input placeholder="Search users..." className="w-64" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Button asChild>
                  <a href="/admin/verification">Go to User Verification</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <p className="font-medium">Verification Report</p>
                  <p className="text-sm text-gray-500 mt-1">Export verification statistics</p>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <p className="font-medium">User Activity Report</p>
                  <p className="text-sm text-gray-500 mt-1">Export user activity data</p>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <p className="font-medium">Job Posting Report</p>
                  <p className="text-sm text-gray-500 mt-1">Export job posting statistics</p>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center">
                  <p className="font-medium">Application Analytics</p>
                  <p className="text-sm text-gray-500 mt-1">Export application data</p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
