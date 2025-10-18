"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { 
  ArrowLeft,
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Calendar,
  FileText,
  Download,
  Edit,
  Save,
  X,
  User,
  Globe,
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

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [contactedBy, setContactedBy] = useState('');

  const { data: candidate, isLoading, error } = api.candidatePool.getById.useQuery(
    { id: candidateId },
    { enabled: !!candidateId }
  );

  const updateStatusMutation = api.candidatePool.updateStatus.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      setNotes('');
      setContactedBy('');
    },
  });

  const deleteMutation = api.candidatePool.delete.useMutation({
    onSuccess: () => {
      router.push('/admin/candidate-pool');
    },
  });

  const handleStatusUpdate = async () => {
    if (!candidate) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        id: candidate.id,
        status: candidate.status,
        notes: notes || undefined,
        contactedBy: contactedBy || undefined,
      });
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  const handleDelete = async () => {
    if (!candidate) return;
    
    if (confirm(`Are you sure you want to delete ${candidate.fullName}?`)) {
      try {
        await deleteMutation.mutateAsync({ id: candidate.id });
      } catch (error) {
        console.error('Error deleting candidate:', error);
      }
    }
  };

  const downloadCV = () => {
    if (candidate?.cvFilePath) {
      const link = document.createElement('a');
      link.href = candidate.cvFilePath;
      link.download = `${candidate.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Candidate Not Found</h2>
              <p className="text-gray-600 mb-4">The candidate you're looking for doesn't exist or has been deleted.</p>
              <Button onClick={() => router.push('/admin/candidate-pool')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Candidate Pool
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/admin/candidate-pool')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{candidate.fullName}</h1>
            <p className="text-gray-600">Candidate Profile</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={STATUS_COLORS[candidate.status]}>
            {STATUS_LABELS[candidate.status]}
          </Badge>
          {candidate.needsVisaSponsorship && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Needs Visa
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                  <p className="text-lg font-semibold">{candidate.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
                      {candidate.email}
                    </a>
                  </div>
                </div>
                {candidate.phoneNumber && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${candidate.phoneNumber}`} className="text-blue-600 hover:underline">
                        {candidate.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-600">Country</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{candidate.country}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Profession</Label>
                  <p className="text-lg font-semibold">{candidate.profession}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Years of Experience</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-semibold">{candidate.yearsOfExperience} years</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Education Level</Label>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-semibold">
                      {candidate.educationLevel.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Job Alerts</Label>
                  <div className="flex items-center gap-2">
                    {candidate.jobAlerts ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>{candidate.jobAlerts ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>

              {candidate.skills.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {candidate.preferredDestination.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Preferred Destinations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidate.preferredDestination.map((destination) => (
                      <Badge key={destination} variant="outline" className="text-blue-600 border-blue-200">
                        <Globe className="h-3 w-3 mr-1" />
                        {destination}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CV Section */}
          {candidate.cvFilePath && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  CV Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">CV Document</p>
                      <p className="text-sm text-gray-600">PDF file uploaded</p>
                    </div>
                  </div>
                  <Button onClick={downloadCV}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Status Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Status</Label>
                <Select
                  value={candidate.status}
                  onValueChange={(value) => {
                    // Update candidate status immediately for UI
                    candidate.status = value as CandidateStatus;
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="PLACED">Placed</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Contacted By</Label>
                <Input
                  value={contactedBy}
                  onChange={(e) => setContactedBy(e.target.value)}
                  placeholder="Admin name or team"
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this candidate..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleStatusUpdate}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1"
                >
                  {updateStatusMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Details */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registered</span>
                <span className="text-sm font-medium">
                  {new Date(candidate.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">
                  {new Date(candidate.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {candidate.contactedAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contacted</span>
                  <span className="text-sm font-medium">
                    {new Date(candidate.contactedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {candidate.contactedBy && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contacted By</span>
                  <span className="text-sm font-medium">{candidate.contactedBy}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              {candidate.phoneNumber && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`tel:${candidate.phoneNumber}`, '_blank')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              )}
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserX className="mr-2 h-4 w-4" />
                )}
                Delete Candidate
              </Button>
            </CardContent>
          </Card>

          {/* Notes History */}
          {candidate.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{candidate.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
