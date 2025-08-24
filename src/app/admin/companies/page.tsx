"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Building2, ExternalLink, MapPin, Users, Search, Check, X } from "lucide-react";

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  // Fetch companies
  const { data: companiesData, isLoading, refetch } = api.companies.getAll.useQuery({
    search: searchTerm || undefined,
  });

  // Extract companies from the response
  const companies = companiesData?.companies || [];

  // Mutations for company verification
  const verifyCompany = api.companies.verifyCompany.useMutation({
    onSuccess: () => refetch()
  });

  const rejectCompany = api.companies.rejectCompany.useMutation({
    onSuccess: () => refetch()
  });

  const selectedCompanyData = selectedCompany 
    ? companies.find(company => company.id === selectedCompany)
    : null;

  const getStatusColor = (verified: boolean, status: string) => {
    if (status === "PENDING") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (status === "APPROVED") return "bg-green-100 text-green-800 border-green-200";
    if (status === "REJECTED") return "bg-red-100 text-red-800 border-red-200";
    if (status === "NEED_MORE_INFO") return "bg-blue-100 text-blue-800 border-blue-200";
    return verified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Companies Management</h1>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search companies by name, industry, or location..."
              className="pl-10 pr-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Companies ({companies.length || 0})
            </h2>
            
            {!companies.length ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No companies found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {companies.map((company) => (
                  <Card
                    key={company.id}
                    className={`cursor-pointer transition-shadow hover:shadow-md ${selectedCompany === company.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedCompany(company.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                              <Building2 className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                          
                          <div>
                            <h3 className="font-semibold text-lg">{company.name}</h3>
                            <div className="text-sm text-gray-600">{company.industry}</div>
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(company.verified, company.verificationStatus)}>
                          {company.verificationStatus}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        {company.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {company.location}
                          </div>
                        )}
                        
                        {company.size && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {company.size}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected Company Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Company Details
            </h2>
            
            {selectedCompanyData ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold">
                      {selectedCompanyData.name}
                    </CardTitle>
                    <Badge className={getStatusColor(selectedCompanyData.verified, selectedCompanyData.verificationStatus)}>
                      {selectedCompanyData.verificationStatus}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Company Description */}
                  {selectedCompanyData.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">
                        {selectedCompanyData.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Company Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Industry</h4>
                      <p className="text-sm text-gray-600">
                        {selectedCompanyData.industry || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Size</h4>
                      <p className="text-sm text-gray-600">
                        {selectedCompanyData.size || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                      <p className="text-sm text-gray-600">
                        {selectedCompanyData.location || "Not specified"}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Website</h4>
                      {selectedCompanyData.website ? (
                        <a
                          href={selectedCompanyData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {selectedCompanyData.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="text-sm text-gray-600">Not specified</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Verification Notes */}
                  {selectedCompanyData.verificationNotes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Verification Notes</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedCompanyData.verificationNotes}
                      </p>
                    </div>
                  )}
                  
                  {/* Verification Actions */}
                  {selectedCompanyData.verificationStatus === "PENDING" && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        onClick={() => verifyCompany.mutate({ companyId: selectedCompanyData.id })}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Verify
                      </Button>
                      
                      <Button
                        onClick={() => rejectCompany.mutate({ companyId: selectedCompanyData.id })}
                        variant="destructive"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a company to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
