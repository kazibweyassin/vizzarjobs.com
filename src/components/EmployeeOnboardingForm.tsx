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
  User 
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

export function EmployeeJobSeekerProfileForm({ companies = [], user }: JobSeekerProfileFormProps) {
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
  });

  const updateProfileMutation = api.users.updateJobSeekerProfile.useMutation({
    onSuccess: async (profile) => {
      await update({
        user: {
          ...user,
          role: "JOB_SEEKER",
          profileComplete: true,
        },
      });
      setIsSubmitting(false);
      router.push("/onboarding/steps");
    },
    onError: (error) => {
      console.error("Failed to start onboarding:", error);
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await startOnboardingMutation.mutate({
        companyId: formData.companyId,
        position: formData.position,
        department: formData.department || undefined,
        startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
        employmentType: formData.employmentType,
        salary: formData.salary ? Number(formData.salary) : undefined,
        manager: formData.manager || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        emergencyPhone: formData.emergencyPhone || undefined,
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setFormStep(formStep + 1);
  };

  const prevStep = () => {
    setFormStep(formStep - 1);
  };

  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                id="companyId"
                name="companyId"
                value={formData.companyId}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="e.g. Engineering"
              />
            </div>
            
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Salary (Annual)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 pl-7 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="e.g. 80000"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                Manager's Name
              </label>
              <input
                type="text"
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="e.g. John Smith"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="e.g. Jane Smith"
              />
            </div>
            
            <div>
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="e.g. +1234567890"
              />
            </div>
            
            <div className="pt-4">
              <h4 className="font-medium text-gray-700 mb-2">What happens next?</h4>
              <p className="text-sm text-gray-600 mb-4">
                After submitting this form, you'll be guided through the onboarding process which includes:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Document verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Company policy review</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Orientation scheduling</span>
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Employee Onboarding</CardTitle>
            <CardDescription>Let's get you set up at your new company</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Step {formStep} of 3
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full ${
                      step <= formStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Company Details</span>
                <span>Employment Details</span>
                <span>Final Steps</span>
              </div>
            </div>
            
            {renderFormStep()}
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {formStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
        )}
        
        <div className="flex justify-end flex-1">
          {formStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Start Onboarding
                </>
              )}
            </button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
