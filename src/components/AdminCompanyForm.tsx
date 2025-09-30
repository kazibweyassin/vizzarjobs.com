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
  Users, 
  Link as LinkIcon,
  Loader2,
  Save,
  CheckCircle
} from "lucide-react";
import { api } from "~/trpc/react";

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

export function AdminCompanyForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<AdminCompanyFormData>({
    name: "",
    description: "",
    website: "",
    logo: "",
    size: "",
    industry: "",
    location: "",
    verified: true, // Admin can create verified companies
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AdminCompanyFormData, string>>>({});

  const createCompanyMutation = api.companies.create.useMutation({
    onSuccess: (company) => {
      router.push(`/admin/companies`);
    },
    onError: (error) => {
      setErrors({ name: error.message });
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
    if (errors[name as keyof AdminCompanyFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AdminCompanyFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.description.trim()) newErrors.description = "Company description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.industry.trim()) newErrors.industry = "Industry is required";
    
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
      await createCompanyMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        website: formData.website || undefined,
        logo: formData.logo || undefined,
        size: formData.size || undefined,
        industry: formData.industry,
        location: formData.location,
        verified: formData.verified,
      });
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Create New Company (Admin)
        </CardTitle>
        <CardDescription>
          Create a new company profile as an administrator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. TechCorp Solutions"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className={`w-full rounded-md border px-3 py-2 ${errors.industry ? "border-red-500" : "border-gray-300"}`}
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
              {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Company Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what your company does, its mission, values, and what makes it special..."
              rows={6}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Location and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="size">Company Size</Label>
              <select
                id="size"
                name="size"
                value={formData.size}
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
          </div>

          {/* Website and Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://company.com"
              />
            </div>
            
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                placeholder="https://company.com/logo.png"
              />
            </div>
          </div>

          {/* Admin Options */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Admin Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="verified">Verified Company</Label>
                <Badge variant="secondary">Company is pre-approved</Badge>
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
                  Creating Company...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Company
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
