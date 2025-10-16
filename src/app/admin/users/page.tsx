"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { 
  Users, 
  Search, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Download
} from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  // Fetch users with filters
  const { data: usersData, isLoading, refetch } = api.users.getAllUsers.useQuery({
    search: searchTerm || undefined,
    role: roleFilter !== "ALL" ? roleFilter as "USER" | "JOB_SEEKER" | "EMPLOYER" | "EMPLOYEE" | "ADMIN" : undefined,
    status: statusFilter !== "ALL" ? statusFilter as "PENDING" | "APPROVED" | "REJECTED" | "NEED_MORE_INFO" : undefined,
  });

  // Extract users from the response
  const users = usersData?.users || [];
  const totalCount = usersData?.totalCount || 0;

  // Verification mutations
  const verifyUser = api.users.verifyUser.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedUser(null);
    }
  });

  const rejectUser = api.users.rejectUser.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedUser(null);
    }
  });

  const requestMoreInfo = api.users.requestMoreInfo.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedUser(null);
    }
  });

  const selectedUserData = selectedUser 
    ? users.find(user => user.id === selectedUser)
    : null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800 border-red-200";
      case "EMPLOYER": return "bg-blue-100 text-blue-800 border-blue-200";
      case "JOB_SEEKER": return "bg-green-100 text-green-800 border-green-200";
      case "EMPLOYEE": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      case "NEED_MORE_INFO": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage and monitor all platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Job Seekers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === "JOB_SEEKER").length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Employers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === "EMPLOYER").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.verificationStatus === "APPROVED").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="ALL">All Roles</option>
                <option value="JOB_SEEKER">Job Seekers</option>
                <option value="EMPLOYER">Employers</option>
                <option value="EMPLOYEE">Employees</option>
                <option value="ADMIN">Admins</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
                <option value="NEED_MORE_INFO">Need More Info</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedUser === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name || 'No Name'}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(user.verificationStatus)}>
                          {user.verificationStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {formatDate(user.createdAt)}
                      </span>
                      {user.updatedAt !== user.createdAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Updated {formatDate(user.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {users.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No users found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Details */}
        <div className="lg:col-span-1">
          {selectedUserData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {selectedUserData.name?.charAt(0)?.toUpperCase() || selectedUserData.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <h3 className="text-lg font-semibold">{selectedUserData.name || 'No Name'}</h3>
                  <p className="text-gray-600">{selectedUserData.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <Badge className={`mt-1 ${getRoleColor(selectedUserData.role)}`}>
                      {selectedUserData.role}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Verification Status</label>
                    <Badge className={`mt-1 ${getStatusColor(selectedUserData.verificationStatus)}`}>
                      {selectedUserData.verificationStatus}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Profile Complete</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedUserData.profileComplete ? 'Yes' : 'No'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Premium</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedUserData.premium ? 'Yes' : 'No'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Joined</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(selectedUserData.createdAt)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(selectedUserData.updatedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  {selectedUserData.verificationStatus === "PENDING" && (
                    <div className="space-y-2 mb-4">
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => {
                          verifyUser.mutate({ 
                            userId: selectedUserData.id,
                            notes: "Approved by admin"
                          });
                        }}
                        disabled={verifyUser.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {verifyUser.isPending ? "Approving..." : "Approve User"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        size="sm"
                        onClick={() => {
                          rejectUser.mutate({ 
                            userId: selectedUserData.id,
                            notes: "Rejected by admin"
                          });
                        }}
                        disabled={rejectUser.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {rejectUser.isPending ? "Rejecting..." : "Reject User"}
                      </Button>
                    </div>
                  )}
                  
                  <Button className="w-full mb-2" size="sm">
                    Edit User
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => {
                      window.open(`/admin/users/${selectedUserData.id}`, '_blank');
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a user to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
