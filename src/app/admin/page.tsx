"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Building2, Contact, FileText, User } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name || "Admin"}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Quick stats cards */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Companies</p>
                <h3 className="text-2xl font-bold text-gray-900">--</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Jobs</p>
                <h3 className="text-2xl font-bold text-gray-900">--</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Users</p>
                <h3 className="text-2xl font-bold text-gray-900">--</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Contact className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Requests</p>
                <h3 className="text-2xl font-bold text-gray-900">--</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <a 
            href="/admin/contact-requests" 
            className="p-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg flex items-center gap-3"
          >
            <Contact className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium">Review Contact Requests</h3>
              <p className="text-sm text-gray-600">Approve or reject company addition requests</p>
            </div>
          </a>
          
          <a 
            href="/admin/companies" 
            className="p-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg flex items-center gap-3"
          >
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium">Manage Companies</h3>
              <p className="text-sm text-gray-600">View and edit company information</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
