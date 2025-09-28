"use client";

import { useState, useRef } from "react";
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
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Briefcase,
  CheckCircle, 
  Loader2, 
  Save,
  Upload,
  Image as ImageIcon,
  X
} from "lucide-react";

interface Company {
  id: string;
  name: string;
}

interface EmployerProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function EmployerProfileForm({ user }: EmployerProfileFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    companyLogo: "",
    companySize: "",
    companyIndustry: "",
    companyLocation: "",
    userId: user?.id || "",
  });

  const createCompanyMutation = api.companies.create.useMutation({
    onSuccess: async (company) => {
      await update({
        user: {
          ...user,
          role: "EMPLOYER",
          profileComplete: true
        }
      });
      
      setIsSubmitting(false);
      router.push('/dashboard/employer');
    },
    onError: (error) => {
      console.error("Error creating company:", error);
      setIsSubmitting(false);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Update form data with file name for now (we'll handle upload later)
      setFormData({
        ...formData,
        companyLogo: file.name
      });
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData({
      ...formData,
      companyLogo: ""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use logo preview URL if file was uploaded, otherwise use the URL input
      const logoUrl = logoPreview || formData.companyLogo || undefined;
      
      createCompanyMutation.mutate({
        name: formData.companyName,
        description: formData.companyDescription || undefined,
        website: formData.companyWebsite || undefined,
        logo: logoUrl,
        size: formData.companySize || undefined,
        industry: formData.companyIndustry || undefined,
        location: formData.companyLocation || undefined,
      });
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
        <CardTitle className="text-2xl flex items-center">
          <Building2 className="mr-3 h-7 w-7 text-blue-600" />
          Complete Your Employer Profile
        </CardTitle>
        <CardDescription className="text-base">
          Create a compelling company profile with your logo and company story to attract the best talent. 
          A complete profile helps job seekers understand your company culture and values.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-blue-500" />
                Company Information
              </h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Your company name"
                    required
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium" htmlFor="companyDescription">
                    About Us *
                  </label>
                  <textarea
                    id="companyDescription"
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm h-40"
                    placeholder="Tell us about your company, its mission, values, and what makes it unique. This will help job seekers understand your company culture and decide if they want to work with you."
                    required
                  />
                  <p className="text-xs text-gray-500">
                    A compelling company description helps attract the right talent. Include your mission, values, and what makes your company special.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="companyWebsite">
                    Website
                  </label>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://yourcompany.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Company Logo
                  </label>
                  
                  {/* Logo Upload Area */}
                  <div className="space-y-3">
                    {logoPreview ? (
                      <div className="relative">
                        <div className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{logoFile?.name}</p>
                            <p className="text-xs text-gray-500">
                              {(logoFile?.size ? (logoFile.size / 1024 / 1024).toFixed(2) : '0')} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900">Upload your company logo</p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <button
                          type="button"
                          className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </button>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    
                    {/* Alternative: URL Input */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">Or provide a logo URL:</p>
                      <input
                        id="companyLogo"
                        name="companyLogo"
                        type="url"
                        value={formData.companyLogo}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="https://yourcompany.com/logo.png"
                      />
                    </div>
                  </div>
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
                Company Details
              </h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="companySize">
                    Company Size
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1001+">1001+ employees</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="companyIndustry">
                    Industry
                  </label>
                  <select
                    id="companyIndustry"
                    name="companyIndustry"
                    value={formData.companyIndustry}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium" htmlFor="companyLocation">
                    Location
                  </label>
                  <input
                    id="companyLocation"
                    name="companyLocation"
                    type="text"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="City, Country"
                    required
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Company
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t px-6 py-4">
        <div className="text-sm text-gray-500">
          <p className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Your company will need to be verified before you can post jobs.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}