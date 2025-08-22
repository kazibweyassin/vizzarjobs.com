"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { 
  Check, 
  X, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Building, 
  User, 
  Filter
} from "lucide-react";

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState("companies");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [verificationNotes, setVerificationNotes] = useState("");

  // Fetch companies for verification
  const { data: companies, refetch: refetchCompanies } = api.companies.getPendingVerifications.useQuery({
    status: statusFilter as "PENDING" | "APPROVED" | "REJECTED" | "NEED_MORE_INFO"
  });

  // Fetch users for verification
  const { data: users, refetch: refetchUsers } = api.users.getPendingVerifications.useQuery({
    status: statusFilter as "PENDING" | "APPROVED" | "REJECTED" | "NEED_MORE_INFO"
  });

  // Mutations for company verification
  const verifyCompany = api.companies.verifyCompany.useMutation({
    onSuccess: () => refetchCompanies()
  });

  const rejectCompany = api.companies.rejectCompany.useMutation({
    onSuccess: () => refetchCompanies()
  });

  const requestMoreInfoCompany = api.companies.requestMoreInfo.useMutation({
    onSuccess: () => refetchCompanies()
  });

  // Mutations for user verification
  const verifyUser = api.users.verifyUser.useMutation({
    onSuccess: () => refetchUsers()
  });

  const rejectUser = api.users.rejectUser.useMutation({
    onSuccess: () => refetchUsers()
  });

  const handleVerifyCompany = (companyId: string) => {
    verifyCompany.mutate({
      companyId,
      notes: verificationNotes
    });
    setVerificationNotes("");
    setSelectedCompanyId(null);
  };

  const handleRejectCompany = (companyId: string) => {
    rejectCompany.mutate({
      companyId,
      notes: verificationNotes
    });
    setVerificationNotes("");
    setSelectedCompanyId(null);
  };

  const handleRequestMoreInfo = (companyId: string) => {
    requestMoreInfoCompany.mutate({
      companyId,
      notes: verificationNotes
    });
    setVerificationNotes("");
    setSelectedCompanyId(null);
  };

  const handleVerifyUser = (userId: string) => {
    verifyUser.mutate({
      userId,
      notes: verificationNotes
    });
    setVerificationNotes("");
    setSelectedCompanyId(null);
  };

  const handleRejectUser = (userId: string) => {
    rejectUser.mutate({
      userId,
      notes: verificationNotes
    });
    setVerificationNotes("");
    setSelectedCompanyId(null);
  };

  // Helper for status badges
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Verified</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case "NEED_MORE_INFO":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Need Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Filter companies or users based on search
  const filteredCompanies = companies?.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Verification Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Verifications</p>
                <h3 className="text-2xl font-bold">
                  {activeTab === "companies" 
                    ? companies?.filter(c => c.verificationStatus === "PENDING").length || 0
                    : users?.filter(u => u.verificationStatus === "PENDING").length || 0
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Verified</p>
                <h3 className="text-2xl font-bold">
                  {activeTab === "companies" 
                    ? companies?.filter(c => c.verificationStatus === "APPROVED").length || 0
                    : users?.filter(u => u.verificationStatus === "APPROVED").length || 0
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <X className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Rejected</p>
                <h3 className="text-2xl font-bold">
                  {activeTab === "companies" 
                    ? companies?.filter(c => c.verificationStatus === "REJECTED").length || 0
                    : users?.filter(u => u.verificationStatus === "REJECTED").length || 0
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Need More Info</p>
                <h3 className="text-2xl font-bold">
                  {activeTab === "companies" 
                    ? companies?.filter(c => c.verificationStatus === "NEED_MORE_INFO").length || 0
                    : users?.filter(u => u.verificationStatus === "NEED_MORE_INFO").length || 0
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Lists */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Verification Requests</CardTitle>
            </CardHeader>
            
            <div className="px-6 pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="companies" className="flex-1">
                    <Building className="h-4 w-4 mr-2" />
                    Companies
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex-1">
                    <User className="h-4 w-4 mr-2" />
                    Users
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="p-6 pt-2 space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => {
                    // Toggle between status filters
                    const nextStatus = 
                      statusFilter === "PENDING" ? "APPROVED" :
                      statusFilter === "APPROVED" ? "REJECTED" : 
                      statusFilter === "REJECTED" ? "NEED_MORE_INFO" : "PENDING";
                    setStatusFilter(nextStatus);
                  }}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                {["PENDING", "APPROVED", "REJECTED", "NEED_MORE_INFO"].map(status => (
                  <Badge 
                    key={status} 
                    variant={statusFilter === status ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
              
              {/* List */}
              <div className="space-y-2 mt-4 max-h-[500px] overflow-y-auto">
                {activeTab === "companies" ? (
                  filteredCompanies && filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <div 
                        key={company.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                          selectedCompanyId === company.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedCompanyId(company.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{company.name}</h4>
                            <div className="text-sm text-gray-500">{company.industry}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={company.verificationStatus} />
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No companies found matching your criteria.
                    </div>
                  )
                ) : (
                  filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div 
                        key={user.id}
                        className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                          selectedCompanyId === user.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedCompanyId(user.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{user.name || "Unnamed User"}</h4>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={user.verificationStatus} />
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No users found matching your criteria.
                    </div>
                  )
                )}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right Panel - Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Verification Details</CardTitle>
            </CardHeader>
            
            <CardContent>
              {selectedCompanyId ? (
                activeTab === "companies" ? (
                  // Company details
                  companies?.find(c => c.id === selectedCompanyId) && (
                    <div className="space-y-6">
                      {(() => {
                        const company = companies!.find(c => c.id === selectedCompanyId)!;
                        return (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-4">{company.name}</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">Industry:</span>
                                    <span>{company.industry || "Not specified"}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">Location:</span>
                                    <span>{company.location || "Not specified"}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">Website:</span>
                                    <span>
                                      {company.website ? (
                                        <a 
                                          href={company.website} 
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          {company.website}
                                        </a>
                                      ) : (
                                        "Not provided"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">Size:</span>
                                    <span>{company.size || "Not specified"}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">Status:</span>
                                    <StatusBadge status={company.verificationStatus} />
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-gray-700">{company.description || "No description provided."}</p>
                                
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2">Verification Checklist</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <input type="checkbox" className="mr-2" />
                                      <label>Website legitimacy verified</label>
                                    </div>
                                    <div className="flex items-center">
                                      <input type="checkbox" className="mr-2" />
                                      <label>Company registration confirmed</label>
                                    </div>
                                    <div className="flex items-center">
                                      <input type="checkbox" className="mr-2" />
                                      <label>Visa sponsorship capability confirmed</label>
                                    </div>
                                    <div className="flex items-center">
                                      <input type="checkbox" className="mr-2" />
                                      <label>Contact information validated</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Verification Notes</h4>
                              <Textarea 
                                placeholder="Add notes about this company's verification..."
                                value={verificationNotes}
                                onChange={(e) => setVerificationNotes(e.target.value)}
                                rows={4}
                              />
                              
                              {company.verificationNotes && (
                                <div className="mt-2 p-3 bg-gray-50 rounded border text-sm">
                                  <strong>Previous Notes:</strong> {company.verificationNotes}
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )
                ) : (
                  // User details
                  users?.find(u => u.id === selectedCompanyId) && (
                    <div className="space-y-6">
                      {(() => {
                        const user = users!.find(u => u.id === selectedCompanyId)!;
                        return (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-4">{user.name || "Unnamed User"}</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">Email:</span>
                                    <span>{user.email || "Not provided"}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">Location:</span>
                                    <span>{user.location || "Not specified"}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">LinkedIn:</span>
                                    <span>
                                      {user.linkedinUrl ? (
                                        <a 
                                          href={user.linkedinUrl} 
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          Profile
                                        </a>
                                      ) : (
                                        "Not provided"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">GitHub:</span>
                                    <span>
                                      {user.githubUrl ? (
                                        <a 
                                          href={user.githubUrl} 
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          Profile
                                        </a>
                                      ) : (
                                        "Not provided"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-gray-500 w-24">Status:</span>
                                    <StatusBadge status={user.verificationStatus} />
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Bio</h4>
                                <p className="text-gray-700">{user.bio || "No bio provided."}</p>
                                
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2">Skills</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {user.skills && user.skills.length > 0 ? (
                                      user.skills.map((skill, i) => (
                                        <Badge key={i} variant="secondary">{skill}</Badge>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">No skills listed</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <h4 className="font-medium mb-2">Resume/CV</h4>
                                  {user.resume ? (
                                    <Button variant="outline" size="sm">
                                      View Resume
                                    </Button>
                                  ) : (
                                    <span className="text-gray-500">No resume uploaded</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Verification Notes</h4>
                              <Textarea 
                                placeholder="Add notes about this user's verification..."
                                value={verificationNotes}
                                onChange={(e) => setVerificationNotes(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Select a {activeTab === "companies" ? "company" : "user"} from the list to view details.
                </div>
              )}
            </CardContent>
            
            {selectedCompanyId && (
              <CardFooter className="flex justify-end gap-2 border-t pt-6">
                {activeTab === "companies" ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => handleRequestMoreInfo(selectedCompanyId)}
                    >
                      Request Info
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleRejectCompany(selectedCompanyId)}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleVerifyCompany(selectedCompanyId)}
                    >
                      Verify
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="destructive"
                      onClick={() => handleRejectUser(selectedCompanyId)}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleVerifyUser(selectedCompanyId)}
                    >
                      Verify
                    </Button>
                  </>
                )}
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
