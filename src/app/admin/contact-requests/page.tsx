"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Building2, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Users
} from "lucide-react";

type ContactRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function AdminContactRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<ContactRequestStatus | "ALL">("PENDING");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = api.contact.getAll.useInfiniteQuery(
    {
      status: selectedStatus === "ALL" ? undefined : selectedStatus,
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const updateStatusMutation = api.contact.updateStatus.useMutation({
    onSuccess: () => {
      void refetch();
      setSelectedRequest(null);
    },
  });

  const requests = data?.pages.flatMap((page) => page.items) ?? [];

  const handleStatusUpdate = (id: string, status: ContactRequestStatus, adminNotes?: string) => {
    updateStatusMutation.mutate({ id, status, adminNotes });
  };

  const getStatusColor = (status: ContactRequestStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ContactRequestStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contact requests...</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedRequestData = selectedRequest 
    ? requests.find(r => r.id === selectedRequest)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contact Requests Management
          </h1>
          <p className="text-gray-600">
            Review and manage company addition requests
          </p>
        </div>

        {/* Status Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status as ContactRequestStatus | "ALL")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                  {status !== "ALL" && (
                    <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                      {requests.filter(r => r.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Requests List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Requests ({requests.length})
            </h2>
            
            {requests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No contact requests found</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {requests.map((request) => (
                  <Card 
                    key={request.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRequest === request.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {request.companyName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {request.contactName} • {request.industry}
                          </p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {request.companySize}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {request.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {hasNextPage && (
                  <button
                    onClick={() => void fetchNextPage()}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Load More
                  </button>
                )}
              </>
            )}
          </div>

          {/* Request Details */}
          <div className="lg:sticky lg:top-4">
            {selectedRequestData ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {selectedRequestData.companyName}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        Request Details
                      </p>
                    </div>
                    <Badge className={getStatusColor(selectedRequestData.status)}>
                      {getStatusIcon(selectedRequestData.status)}
                      <span className="ml-1">{selectedRequestData.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedRequestData.contactEmail}</span>
                      </div>
                      {selectedRequestData.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedRequestData.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Company Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Industry:</span>
                        <span className="text-sm text-gray-600 ml-2">{selectedRequestData.industry}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Size:</span>
                        <span className="text-sm text-gray-600 ml-2">{selectedRequestData.companySize}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Location:</span>
                        <span className="text-sm text-gray-600 ml-2">{selectedRequestData.location}</span>
                      </div>
                      {selectedRequestData.website && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Website:</span>
                          <a 
                            href={selectedRequestData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 ml-2 flex items-center gap-1"
                          >
                            {selectedRequestData.website}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedRequestData.description}
                    </p>
                  </div>

                  {/* Visa Sponsorship */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Visa Sponsorship</h4>
                    <div className="flex items-center gap-2">
                      {selectedRequestData.visaSponsorshipConfirmed ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">Confirmed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="text-sm text-red-700 font-medium">Not Confirmed</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {selectedRequestData.adminNotes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Admin Notes</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedRequestData.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {selectedRequestData.status === "PENDING" && (
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => handleStatusUpdate(selectedRequestData.id, "APPROVED")}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedRequestData.id, "REJECTED")}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a request to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
