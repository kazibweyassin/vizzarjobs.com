"use client";

import { useState } from 'react';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { 
  Users, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  UserX,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { CandidateStatus } from '@prisma/client';

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800 border-green-200',
  CONTACTED: 'bg-blue-100 text-blue-800 border-blue-200',
  PLACED: 'bg-purple-100 text-purple-800 border-purple-200',
  INACTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
};

const STATUS_LABELS = {
  ACTIVE: 'Active',
  CONTACTED: 'Contacted',
  PLACED: 'Placed',
  INACTIVE: 'Inactive',
};

export default function AdminCandidatePoolPage() {
  const [filters, setFilters] = useState({
    profession: '',
    destination: '',
    needsVisaSponsorship: undefined as boolean | undefined,
    status: undefined as CandidateStatus | undefined,
    search: '',
  });
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const { data: candidatesData, isLoading, refetch } = api.candidatePool.getAll.useQuery({
    profession: filters.profession || undefined,
    destination: filters.destination || undefined,
    needsVisaSponsorship: filters.needsVisaSponsorship,
    status: filters.status,
    search: filters.search || undefined,
    limit: 20,
    cursor,
  });

  const { data: stats } = api.candidatePool.getStats.useQuery();

  const updateStatusMutation = api.candidatePool.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMutation = api.candidatePool.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const exportCSVMutation = api.candidatePool.exportCSV.useMutation();

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCursor(undefined);
  };

  const clearFilters = () => {
    setFilters({
      profession: '',
      destination: '',
      needsVisaSponsorship: undefined,
      status: undefined,
      search: '',
    });
    setCursor(undefined);
  };

  const handleStatusUpdate = async (candidateId: string, newStatus: CandidateStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: candidateId,
        status: newStatus,
        contactedBy: 'Admin',
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (candidateId: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      try {
        await deleteMutation.mutateAsync({ id: candidateId });
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const result = await exportCSVMutation.mutateAsync({
        profession: filters.profession || undefined,
        destination: filters.destination || undefined,
        needsVisaSponsorship: filters.needsVisaSponsorship,
        status: filters.status,
      });

      // Create CSV content
      const csvContent = [
        result.headers.join(','),
        ...result.rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const candidates = candidatesData?.candidates || [];
  const nextCursor = candidatesData?.nextCursor;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Pool</h1>
          <p className="text-gray-600">Manage and track talent pool candidates</p>
        </div>
        <Button onClick={handleExportCSV} disabled={exportCSVMutation.isPending}>
          {exportCSVMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Contacted</p>
                  <p className="text-2xl font-bold">{stats.contacted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Placed</p>
                  <p className="text-2xl font-bold">{stats.placed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Need Visa</p>
                  <p className="text-2xl font-bold">{stats.needsVisa}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Name, email, skills..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Profession</Label>
              <Input
                placeholder="e.g., Software Engineer"
                value={filters.profession}
                onChange={(e) => handleFilterChange('profession', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input
                placeholder="e.g., United States"
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="PLACED">Placed</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visa Sponsorship</Label>
              <Select
                value={filters.needsVisaSponsorship?.toString() || ''}
                onValueChange={(value) => handleFilterChange('needsVisaSponsorship', value === '' ? undefined : value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="true">Needs Visa</SelectItem>
                  <SelectItem value="false">No Visa Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates ({candidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No candidates found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{candidate.fullName}</h3>
                        <Badge className={STATUS_COLORS[candidate.status]}>
                          {STATUS_LABELS[candidate.status]}
                        </Badge>
                        {candidate.needsVisaSponsorship && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Needs Visa
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{candidate.email}</span>
                        </div>
                        {candidate.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{candidate.phoneNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{candidate.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{candidate.profession}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>{candidate.educationLevel.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{candidate.yearsOfExperience} years exp.</span>
                        </div>
                        {candidate.cvFilePath && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>CV Available</span>
                          </div>
                        )}
                      </div>

                      {candidate.skills.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{candidate.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {candidate.preferredDestination.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">Preferred: </span>
                          <span className="text-sm">{candidate.preferredDestination.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/admin/candidate-pool/${candidate.id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <Select
                        value={candidate.status}
                        onValueChange={(value) => handleStatusUpdate(candidate.id, value as CandidateStatus)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="CONTACTED">Contacted</SelectItem>
                          <SelectItem value="PLACED">Placed</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(candidate.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {nextCursor && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCursor(nextCursor)}
                    disabled={isLoading}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
