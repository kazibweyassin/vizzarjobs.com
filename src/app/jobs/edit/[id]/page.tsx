"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '~/trpc/react';
import { JobType, ExperienceLevel } from '@prisma/client';
import { RichTextEditor } from '~/components/RichTextEditor';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Checkbox } from '~/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { 
  ArrowLeft, 
  Save, 
  Loader2,
  Briefcase,
  MapPin,
  DollarSign,
  Globe,
  Users,
  Code,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function EditJobPage() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    country: '',
    jobType: 'FULL_TIME' as JobType,
    experienceLevel: 'MID' as ExperienceLevel,
    salaryMin: '',
    salaryMax: '',
    visaSponsorship: false,
    remote: false,
    applicationUrl: '',
    requirements: [] as string[],
    skills: [] as string[],
    techStack: [] as string[],
    featured: false,
    premium: false,
  });

  const [requirementInput, setRequirementInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not logged in
  if (status === 'unauthenticated') {
    router.push('/auth/signin?callbackUrl=/jobs/edit/' + jobId);
    return null;
  }

  // Fetch job data
  const { data: jobs } = api.jobs.getByEmployer.useQuery(undefined, {
    enabled: !!sessionData?.user,
  });

  const job = jobs?.find(j => j.id === jobId);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        country: job.country || '',
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        visaSponsorship: job.visaSponsorship,
        remote: job.remote,
        applicationUrl: job.applicationUrl,
        requirements: job.requirements || [],
        skills: job.skills || [],
        techStack: job.techStack || [],
        featured: job.featured,
        premium: job.premium,
      });
      setIsLoading(false);
    }
  }, [job]);

  // Update mutation
  const updateJobMutation = api.jobs.update.useMutation({
    onSuccess: () => {
      router.push('/dashboard/employer/jobs');
    },
    onError: (error) => {
      console.error('Error updating job:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      id: jobId,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
    };

    updateJobMutation.mutate(submitData);
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addTechStack = () => {
    if (techStackInput.trim()) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techStackInput.trim()]
      }));
      setTechStackInput('');
    }
  };

  const removeTechStack = (index: number) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[#0F2C4C]" />
        <p className="mt-4 text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-700 mb-2">Job Not Found</h2>
        <p className="text-red-600 mb-4">The job you're trying to edit doesn't exist or you don't have permission to edit it.</p>
        <Link href="/dashboard/employer/jobs">
          <Button>Back to Job Management</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/employer/jobs">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600 mt-2">Update your job posting details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#0F2C4C]" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="e.g., United States"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="applicationUrl">Application URL *</Label>
                  <Input
                    id="applicationUrl"
                    type="url"
                    value={formData.applicationUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationUrl: e.target.value }))}
                    placeholder="https://company.com/careers/apply"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0F2C4C]" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value: JobType) => setFormData(prev => ({ ...prev, jobType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full Time</SelectItem>
                      <SelectItem value="PART_TIME">Part Time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                      <SelectItem value="INTERNSHIP">Internship</SelectItem>
                      <SelectItem value="FREELANCE">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value: ExperienceLevel) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JUNIOR">Junior</SelectItem>
                      <SelectItem value="MID">Mid Level</SelectItem>
                      <SelectItem value="SENIOR">Senior</SelectItem>
                      <SelectItem value="LEAD">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Minimum Salary</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                    placeholder="80000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Maximum Salary</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                    placeholder="120000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-[#0F2C4C]" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Description *</Label>
                <RichTextEditor
                  content={formData.description}
                  onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
                  height={400}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  placeholder="Add a requirement..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} variant="outline">
                  Add
                </Button>
              </div>
              
              {formData.requirements.length > 0 && (
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{req}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-[#0F2C4C]/10 text-[#0F2C4C] rounded-full text-sm">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-[#0F2C4C] hover:text-[#1a3d63]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="Add a technology..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                />
                <Button type="button" onClick={addTechStack} variant="outline">
                  Add
                </Button>
              </div>
              
              {formData.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map((tech, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTechStack(index)}
                        className="text-[#0F2C4C] hover:text-amber-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[#0F2C4C]" />
                Job Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="visaSponsorship"
                    checked={formData.visaSponsorship}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visaSponsorship: !!checked }))}
                  />
                  <Label htmlFor="visaSponsorship">Visa Sponsorship Available</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={formData.remote}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remote: !!checked }))}
                  />
                  <Label htmlFor="remote">Remote Work Available</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                  />
                  <Label htmlFor="featured">Featured Job</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="premium"
                    checked={formData.premium}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, premium: !!checked }))}
                  />
                  <Label htmlFor="premium">Premium Job</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/employer/jobs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={updateJobMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateJobMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Job
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
