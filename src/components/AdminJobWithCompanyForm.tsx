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
  CheckCircle,
  Copy,
  Clipboard,
  Download,
  Globe
} from "lucide-react";
import { JobType, ExperienceLevel } from "@prisma/client";
import { api } from "~/trpc/react";

interface AdminJobWithCompanyData {
  // Company fields
  companyName: string;
  companyDescription: string;
  companyWebsite: string;
  companyLogo: string;
  companySize: string;
  companyIndustry: string;
  companyLocation: string;
  
  // Job fields
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
  featured: boolean;
  premium: boolean;
  source: string;
}

export function AdminJobWithCompanyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [step, setStep] = useState<"company" | "job">("company");
  
  const [formData, setFormData] = useState<AdminJobWithCompanyData>({
    // Company defaults
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    companyLogo: "",
    companySize: "",
    companyIndustry: "",
    companyLocation: "",
    
    // Job defaults
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
    featured: false,
    premium: false,
    source: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdminJobWithCompanyData, string>>>({});

  const createCompanyMutation = api.companies.create.useMutation();
  const createJobMutation = api.jobs.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AdminJobWithCompanyData]) {
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

  const validateCompanyStep = (): boolean => {
    const newErrors: Partial<Record<keyof AdminJobWithCompanyData, string>> = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.companyDescription.trim()) newErrors.companyDescription = "Company description is required";
    if (!formData.companyIndustry.trim()) newErrors.companyIndustry = "Industry is required";
    if (!formData.companyLocation.trim()) newErrors.companyLocation = "Company location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateJobStep = (): boolean => {
    const newErrors: Partial<Record<keyof AdminJobWithCompanyData, string>> = {};
    
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.description.trim()) newErrors.description = "Job description is required";
    if (!formData.location.trim()) newErrors.location = "Job location is required";
    if (!formData.jobType) newErrors.jobType = "Job type is required";
    if (!formData.experienceLevel) newErrors.experienceLevel = "Experience level is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompanySubmit = async () => {
    if (!validateCompanyStep()) {
      return;
    }
    setStep("job");
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateJobStep()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First create the company
      const company = await createCompanyMutation.mutateAsync({
        name: formData.companyName,
        description: formData.companyDescription,
        website: formData.companyWebsite || undefined,
        logo: formData.companyLogo || undefined,
        size: formData.companySize || undefined,
        industry: formData.companyIndustry,
        location: formData.companyLocation,
        verified: true, // Admin creates verified companies
      });

      // Then create the job
      await createJobMutation.mutateAsync({
        title: formData.title,
        company: formData.companyName,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        country: formData.country,
        visaSponsorship: formData.visaSponsorship,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        jobType: formData.jobType as JobType,
        experienceLevel: formData.experienceLevel as ExperienceLevel,
        techStack: [],
        applicationUrl: formData.applicationUrl,
        companyId: company.id,
        featured: formData.featured,
        premium: formData.premium,
      });

      router.push('/admin');
    } catch (error) {
      console.error("Error creating company and job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create Company & Job (Admin)
          </CardTitle>
          <CardDescription>
            Create a new company and job posting in one streamlined process
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${step === "company" ? "text-blue-600" : "text-green-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "company" ? "bg-blue-100" : "bg-green-100"}`}>
                {step === "company" ? "1" : <CheckCircle className="h-4 w-4" />}
              </div>
              <span className="font-medium">Company Details</span>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-4"></div>
            <div className={`flex items-center gap-2 ${step === "job" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "job" ? "bg-blue-100" : "bg-gray-100"}`}>
                2
              </div>
              <span className="font-medium">Job Details</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Step */}
      {step === "company" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Enter the company details for this job posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g. TechCorp Solutions"
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="companyIndustry">Industry *</Label>
                  <select
                    id="companyIndustry"
                    name="companyIndustry"
                    value={formData.companyIndustry}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border px-3 py-2 ${errors.companyIndustry ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Media">Media</option>
                    <option value="Non-profit">Non-profit</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.companyIndustry && <p className="text-red-500 text-sm mt-1">{errors.companyIndustry}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="companyDescription">Company Description *</Label>
                <Textarea
                  id="companyDescription"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  placeholder="Describe what the company does, its mission, values, and what makes it special..."
                  rows={4}
                  className={errors.companyDescription ? "border-red-500" : ""}
                />
                {errors.companyDescription && <p className="text-red-500 text-sm mt-1">{errors.companyDescription}</p>}
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="companyLocation">Company Location *</Label>
                  <Input
                    id="companyLocation"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleInputChange}
                    placeholder="e.g. San Francisco, CA"
                    className={errors.companyLocation ? "border-red-500" : ""}
                  />
                  {errors.companyLocation && <p className="text-red-500 text-sm mt-1">{errors.companyLocation}</p>}
                </div>
                
                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="source">Source (Optional)</Label>
                  <Input
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="e.g. LinkedIn, Indeed"
                  />
                </div>
              </div>

              {/* Website and Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyWebsite">Website</Label>
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://company.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyLogo">Logo URL</Label>
                  <Input
                    id="companyLogo"
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleInputChange}
                    placeholder="https://company.com/logo.png"
                  />
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-6 border-t">
                <Button onClick={handleCompanySubmit}>
                  Next: Job Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Step */}
      {step === "job" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Details for {formData.companyName}
            </CardTitle>
            <CardDescription>
              Enter the job posting details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJobSubmit} className="space-y-6">
              {/* Job Title */}
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

              {/* Job Description */}
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
                  rows={6}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                  <Label htmlFor="location">Job Location *</Label>
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
                    id="salaryMin"
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

              {/* Submit Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setStep("company")}>
                  Back to Company
                </Button>
                <div className="space-x-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Company & Job...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Company & Job
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
