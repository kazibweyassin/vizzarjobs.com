"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "~/components/ui/card";
import { 
  Briefcase, 
  Building2, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Loader2, 
  Mail, 
  Phone, 
  Save, 
  Upload, 
  User,
  MapPin,
  Globe,
  Linkedin
} from "lucide-react";
import { Badge } from "~/components/ui/badge";

type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

interface Company {
  id: string;
  name: string;
}

interface JobSeekerProfileFormProps {
  companies: Company[];
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function JobSeekerProfileForm({ companies = [], user }: JobSeekerProfileFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    title: "",
    skillsAndExperience: "",
    preferredJobTypes: ["FULL_TIME"] as EmploymentType[],
    desiredSalary: "",
    location: "",
    willingToRelocate: false,
    visaSponsorshipRequired: false,
    linkedInProfile: "",
    portfolioUrl: "",
    userId: user?.id || "",
  });


  const updateProfileMutation = api.users.updateJobSeekerProfile.useMutation({
    onSuccess: async (profile) => {
      await update({
        user: {
          ...user,
          role: "JOB_SEEKER",
          profileComplete: true
        }
      });
      
      setIsSubmitting(false);
      router.push('/profile');
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      setIsSubmitting(false);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === 'preferredJobTypes') {
      // Convert single select value to array for API compatibility
      setFormData({
        ...formData,
        [name]: [value] as EmploymentType[]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Ensure preferredJobTypes is always an array and contains valid values
      let preferredJobTypes = formData.preferredJobTypes;
      
      if (!Array.isArray(preferredJobTypes)) {
        preferredJobTypes = [preferredJobTypes] as EmploymentType[];
      }
      
      // Validate that all values are valid enum values
      const validJobTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
      preferredJobTypes = preferredJobTypes.filter(type => validJobTypes.includes(type));
      
      // Ensure we have at least one valid job type
      if (preferredJobTypes.length === 0) {
        preferredJobTypes = ["FULL_TIME"];
      }
      
      const submitData = {
        ...formData,
        preferredJobTypes,
        userId: user.id
      };
      
      updateProfileMutation.mutate(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  const goToNextStep = () => {
    setFormStep(formStep + 1);
  };

  const goToPreviousStep = () => {
    setFormStep(formStep - 1);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Job Seeker Profile</CardTitle>
        <CardDescription>
          Help us understand your skills, experience, and job preferences to find the best opportunities for you.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-500" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="title">
                    Professional Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="e.g. Software Developer, Marketing Specialist"
                    required
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="City, State, Country"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {formStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
                Skills and Experience
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="skillsAndExperience">
                  Skills and Experience
                </label>
                <textarea
                  id="skillsAndExperience"
                  name="skillsAndExperience"
                  value={formData.skillsAndExperience}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-32"
                  placeholder="Describe your skills, technologies, and work experience"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="preferredJobTypes">
                    Preferred Job Types
                  </label>
                  <select
                    id="preferredJobTypes"
                    name="preferredJobTypes"
                    value={Array.isArray(formData.preferredJobTypes) ? formData.preferredJobTypes[0] || "FULL_TIME" : "FULL_TIME"}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="desiredSalary">
                    Desired Salary
                  </label>
                  <input
                    id="desiredSalary"
                    name="desiredSalary"
                    type="text"
                    value={formData.desiredSalary}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="e.g. $75,000 - $90,000"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {formStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <Globe className="mr-2 h-5 w-5 text-blue-500" />
                Additional Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="willingToRelocate"
                    name="willingToRelocate"
                    type="checkbox"
                    checked={formData.willingToRelocate}
                    onChange={(e) => setFormData({...formData, willingToRelocate: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="willingToRelocate" className="ml-2 block text-sm text-gray-900">
                    Willing to relocate
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="visaSponsorshipRequired"
                    name="visaSponsorshipRequired"
                    type="checkbox"
                    checked={formData.visaSponsorshipRequired}
                    onChange={(e) => setFormData({...formData, visaSponsorshipRequired: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="visaSponsorshipRequired" className="ml-2 block text-sm text-gray-900">
                    Visa sponsorship required
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="linkedInProfile">
                    LinkedIn Profile URL
                  </label>
                  <input
                    id="linkedInProfile"
                    name="linkedInProfile"
                    type="url"
                    value={formData.linkedInProfile}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="portfolioUrl">
                    Portfolio or Website URL
                  </label>
                  <input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
