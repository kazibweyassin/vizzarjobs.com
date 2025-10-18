"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  FileText,
  Link as LinkIcon,
  Award,
  Plus,
  X,
  Loader2,
  Save,
  CheckCircle
} from "lucide-react";
import { RichTextEditor } from "~/components/RichTextEditor";
import { JobType, ExperienceLevel } from "@prisma/client";
import { api } from "~/trpc/react";

interface AdminJobFormData {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  country: string;
  visaSponsorship: boolean;
  salaryMin: string;
  salaryMax: string;
  jobType: JobType | "";
  experienceLevel: ExperienceLevel | "";
  applicationUrl: string;
  companyId: string;
  featured: boolean;
  premium: boolean;
}

interface AdminCompanyFormData {
  name: string;
  description: string;
  website: string;
  logo: string;
  size: string;
  industry: string;
  location: string;
  verified: boolean;
}

export function AdminJobForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRequirement, setCurrentRequirement] = useState("");
  
  const [formData, setFormData] = useState<AdminJobFormData>({
    title: "",
    description: "",
    requirements: [],
    location: "",
    country: "",
    visaSponsorship: true,
    salaryMin: "",
    salaryMax: "",
    jobType: "FULL_TIME" as JobType,
    experienceLevel: "MID" as ExperienceLevel,
    applicationUrl: "",
    companyId: "",
    featured: false,
    premium: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdminJobFormData, string>>>({});

  // Fetch companies for dropdown
  const { data: companiesData } = api.companies.getVerifiedCompanies.useQuery({});
  const companies = companiesData?.companies || [];

  const createJobMutation = api.jobs.create.useMutation({
    onSuccess: (job) => {
      router.push(`/jobs/${job.id}`);
    },
    onError: (error) => {
      setErrors({ companyId: error.message });
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AdminJobFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AdminJobFormData, string>> = {};
    
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.description.trim()) newErrors.description = "Job description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.companyId) newErrors.companyId = "Company is required";
    if (!formData.jobType) newErrors.jobType = "Job type is required";
    if (!formData.experienceLevel) newErrors.experienceLevel = "Experience level is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createJobMutation.mutateAsync({
        title: formData.title,
        company: companies.find(c => c.id === formData.companyId)?.name || "",
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        country: formData.country,
        visaSponsorship: formData.visaSponsorship,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        jobType: formData.jobType as JobType,
        experienceLevel: formData.experienceLevel as ExperienceLevel,
        techStack: [], // Add empty array for techStack
        applicationUrl: formData.applicationUrl,
        companyId: formData.companyId,
        featured: formData.featured,
        premium: formData.premium,
      });
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Create New Job (Admin)
        </CardTitle>
        <CardDescription>
          Create a new job posting as an administrator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Senior Software Engineer"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <Label htmlFor="companyId">Company *</Label>
              <select
                id="companyId"
                name="companyId"
                value={formData.companyId}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 ${errors.companyId ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.companyId && <p className="text-red-500 text-sm mt-1">{errors.companyId}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <RichTextEditor
              content={formData.description}
              onChange={(content) => handleInputChange("description", content)}
              placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
              height={200}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            <p className="text-sm text-gray-500 mt-2">
              Use the formatting tools to create a professional job description with headings, lists, and emphasis.
            </p>
          </div>

          {/* Requirements */}
          <div>
            <Label>Requirements</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  placeholder="Add a requirement..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="flex-1 text-sm">{req}</span>
                    <Button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location and Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. San Francisco, CA"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g. United States"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="visaSponsorship"
                name="visaSponsorship"
                checked={formData.visaSponsorship}
                onChange={handleInputChange}
                className="rounded"
              />
              <Label htmlFor="visaSponsorship">Visa Sponsorship Available</Label>
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salaryMin">Minimum Salary</Label>
              <Input
                id="salaryMin"
                name="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={handleInputChange}
                placeholder="e.g. 80000"
              />
            </div>
            <div>
              <Label htmlFor="salaryMax">Maximum Salary</Label>
              <Input
                id="salaryMax"
                name="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={handleInputChange}
                placeholder="e.g. 120000"
              />
            </div>
          </div>

          {/* Job Type and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobType">Job Type *</Label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 ${errors.jobType ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select job type</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="FREELANCE">Freelance</option>
              </select>
              {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
            </div>
            
            <div>
              <Label htmlFor="experienceLevel">Experience Level *</Label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 ${errors.experienceLevel ? "border-red-500" : "border-gray-300"}`}
              >
                    <option value="">Select experience level</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD">Lead</option>
              </select>
              {errors.experienceLevel && <p className="text-red-500 text-sm mt-1">{errors.experienceLevel}</p>}
            </div>
          </div>

          {/* Application URL */}
          <div>
            <Label htmlFor="applicationUrl">Application URL</Label>
            <Input
              id="applicationUrl"
              name="applicationUrl"
              value={formData.applicationUrl}
              onChange={handleInputChange}
              placeholder="https://company.com/apply"
            />
          </div>

          {/* Admin Options */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Admin Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Job</Label>
                <Badge variant="secondary">Highlights this job</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="premium"
                  name="premium"
                  checked={formData.premium}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="premium">Premium Job</Label>
                <Badge variant="secondary">Requires subscription to view</Badge>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Job...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Job
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
