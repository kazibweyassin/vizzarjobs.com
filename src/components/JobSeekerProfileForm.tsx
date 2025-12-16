"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { RichTextEditor } from "~/components/RichTextEditor";
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

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear?: number | null;
  startDate?: string;
  endDate?: string;
  currentlyStudying?: boolean;
}

interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expirationDate: string;
  doesNotExpire: boolean;
}

interface Project {
  title: string;
  description: string;
  url: string;
  date: string;
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
    // Basic Info
    fullName: user?.name || "",
    title: "",
    phoneNumber: "",
    bio: "",
    location: "",
    
    // Career preferences
    preferredJobTypes: [] as EmploymentType[],
    remotePreference: "",
    desiredSalary: "",
    willingToRelocate: false,
    visaSponsorshipRequired: false,
    yearsOfExperience: "",
    locationPreferences: [] as string[],
    
    // Skills
    skillsAndExperience: "",
    skills: [] as string[],
    languages: [] as string[],
    
    // Education & Experience
    education: [] as Education[],
    workExperience: [] as WorkExperience[],
    certifications: [] as Certification[],
    projectsAndPublications: [] as Project[],
    
    // Online presence
    linkedInProfile: "",
    portfolioUrl: "",
    githubUrl: "",
    twitterUrl: "",
    personalWebsite: "",
    preferredJobTypes: ["FULL_TIME"] as EmploymentType[],
    preferredIndustries: [] as string[],
    desiredSalary: "",
    salaryCurrency: "USD",
    location: "",
    willingToRelocate: false,
    preferredLocations: [] as string[],
    remoteWorkPreference: "HYBRID",
    visaSponsorshipRequired: false,
    workAuthorizationStatus: "",
    noticePeriod: "",
    availabilityDate: "",
    linkedInProfile: "",
    portfolioUrl: "",
    githubProfile: "",
    stackOverflowProfile: "",
    personalStatement: "",
    achievements: [] as string[],
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

  // Initialize form with empty arrays for new fields
  useEffect(() => {
    // Ensure all array fields are initialized
    setFormData(prevData => ({
      ...prevData,
      education: prevData.education.length ? prevData.education : [{ 
        institution: '', 
        degree: '', 
        fieldOfStudy: '', 
        graduationYear: null,
        startDate: '',
        endDate: '',
        currentlyStudying: false
      }],
      workExperience: prevData.workExperience.length ? prevData.workExperience : [{ 
        company: '', 
        title: '', 
        startDate: '', 
        endDate: '', 
        current: false, 
        description: '' 
      }],
      certifications: prevData.certifications || [],
      projectsAndPublications: prevData.projectsAndPublications || [],
      skills: prevData.skills || [],
      languages: prevData.languages || [],
      locationPreferences: prevData.locationPreferences || []
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === 'preferredJobTypes') {
      // Handle job types as multi-select
      const select = e.target as HTMLSelectElement;
      const options = Array.from(select.selectedOptions).map(option => option.value) as EmploymentType[];
      
      setFormData({
        ...formData,
        [name]: options
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
      
      // Convert yearsOfExperience from string to number
      const yearsOfExperience = formData.yearsOfExperience ? parseInt(formData.yearsOfExperience, 10) : null;
      
      // Format availabilityDate
      const availabilityDate = formData.availabilityDate ? new Date(formData.availabilityDate) : null;
      
      // Process work experience to ensure all fields are properly formatted
      const workExperience = formData.workExperience.map(exp => ({
        ...exp,
        startDate: exp.startDate || null,
        endDate: exp.currentlyWorking ? null : (exp.endDate || null)
      }));
      
      // Process education to ensure all fields are properly formatted
      const education = formData.education.map(edu => ({
        ...edu,
        startDate: edu.startDate || null,
        endDate: edu.currentlyStudying ? null : (edu.endDate || null)
      }));
      
      const submitData = {
        ...formData,
        preferredJobTypes,
        yearsOfExperience,
        availabilityDate,
        workExperience,
        education,
        userId: user.id
      };
      
      // Remove any empty arrays to prevent DB errors
      Object.keys(submitData).forEach(key => {
        if (Array.isArray(submitData[key]) && submitData[key].length === 0) {
          submitData[key] = [];
        }
      });
      
      updateProfileMutation.mutate(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  const goToNextStep = () => {
    // Validate current step before proceeding
    const isValid = validateStep(formStep);
    if (isValid) {
      setFormStep(formStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    setFormStep(formStep - 1);
    window.scrollTo(0, 0);
  };
  
  const validateStep = (step: number): boolean => {
    let isValid = true;
    
    switch(step) {
      case 1: // Personal Information
        if (!formData.fullName || !formData.title || !formData.location) {
          isValid = false;
          alert('Please fill in all required fields (Full Name, Professional Title, and Location)');
        }
        break;
      case 2: // Career Preferences
        if (!formData.desiredSalary || formData.preferredJobTypes.length === 0) {
          isValid = false;
          alert('Please enter your desired salary and select at least one job type');
        }
        break;
      case 3: // Education
        // Education is optional
        break;
      case 4: // Skills
        if (!formData.skillsAndExperience || formData.skillsAndExperience.trim().length < 20) {
          isValid = false;
          alert('Please provide more details about your skills and experience (minimum 20 characters)');
        }
        break;
      default:
        break;
    }
    
    return isValid;
  };
  
  // Handle work experience additions
  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          companyName: "",
          title: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: ""
        }
      ]
    });
  };
  
  const updateWorkExperience = (index: number, field: string, value: string | boolean) => {
    const updatedExperiences = [...formData.workExperience];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setFormData({
      ...formData,
      workExperience: updatedExperiences
    });
  };
  
  const removeWorkExperience = (index: number) => {
    const updatedExperiences = [...formData.workExperience];
    updatedExperiences.splice(index, 1);
    setFormData({
      ...formData,
      workExperience: updatedExperiences
    });
  };
  
  // Handle education additions
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          graduationYear: null,
          startDate: "",
          endDate: "",
          currentlyStudying: false
        }
      ]
    });
  };
  
  const updateEducation = (index: number, field: string, value: string | boolean) => {
    const updatedEducations = [...formData.education];
    updatedEducations[index] = {
      ...updatedEducations[index],
      [field]: value
    };
    setFormData({
      ...formData,
      education: updatedEducations
    });
  };
  
  const removeEducation = (index: number) => {
    const updatedEducations = [...formData.education];
    updatedEducations.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducations
    });
  };
  
  // Handle array fields
  const handleArrayField = (field: string, value: string) => {
    if (value && !formData[field].includes(value)) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value]
      });
    }
  };
  
  const removeArrayItem = (field: string, index: number) => {
    const updatedArray = [...formData[field]];
    updatedArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: updatedArray
    });
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
                    Full Name <span className="text-red-500">*</span>
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
                    Professional Title <span className="text-red-500">*</span>
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="location">
                    Current Location <span className="text-red-500">*</span>
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="yearsOfExperience">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select years of experience</option>
                    <option value="0">Less than 1 year</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                    <option value="6">6 years</option>
                    <option value="7">7 years</option>
                    <option value="8">8 years</option>
                    <option value="9">9 years</option>
                    <option value="10">10+ years</option>
                    <option value="15">15+ years</option>
                    <option value="20">20+ years</option>
                  </select>
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium" htmlFor="personalStatement">
                    Professional Summary
                  </label>
                  <RichTextEditor
                    content={formData.personalStatement}
                    onChange={(content) => setFormData({ ...formData, personalStatement: content })}
                    placeholder="Write a brief professional summary highlighting your background, expertise, and career goals"
                    height={120}
                  />
                  <p className="text-xs text-gray-500">
                    Use formatting to make your professional summary more engaging and highlight key achievements.
                  </p>
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
                Work Experience
              </h3>
              
              <p className="text-sm text-gray-600">Add your work experience, starting with the most recent.</p>
              
              {formData.workExperience.map((experience, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Work Experience {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeWorkExperience(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <input
                        type="text"
                        value={experience.companyName}
                        onChange={(e) => updateWorkExperience(index, 'companyName', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Company name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title</label>
                      <input
                        type="text"
                        value={experience.title}
                        onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Your job title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <input
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="month"
                          value={experience.endDate}
                          onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                          disabled={experience.currentlyWorking}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`currentlyWorking-${index}`}
                            checked={experience.currentlyWorking}
                            onChange={(e) => updateWorkExperience(index, 'currentlyWorking', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`currentlyWorking-${index}`} className="ml-2 text-xs">
                            Current job
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <RichTextEditor
                        content={experience.description}
                        onChange={(content) => updateWorkExperience(index, 'description', content)}
                        placeholder="Describe your responsibilities, achievements, and technologies used"
                        height={100}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addWorkExperience}
                className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                + Add Work Experience
              </button>
              
              <div className="flex justify-between pt-4">
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
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                Education
              </h3>
              
              <p className="text-sm text-gray-600">Add your educational background, starting with the most recent.</p>
              
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="School, college, or university name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="e.g. Bachelor's, Master's, PhD"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder="e.g. Computer Science, Business"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          disabled={edu.currentlyStudying}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`currentlyStudying-${index}`}
                            checked={edu.currentlyStudying}
                            onChange={(e) => updateEducation(index, 'currentlyStudying', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`currentlyStudying-${index}`} className="ml-2 text-xs">
                            Currently studying
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center justify-center w-full p-2 border border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              >
                + Add Education
              </button>
              
              <div className="flex justify-between pt-4">
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
          
          {formStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
                Skills
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="skillsAndExperience">
                  Skills Overview <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  content={formData.skillsAndExperience}
                  onChange={(content) => setFormData({ ...formData, skillsAndExperience: content })}
                  placeholder="Provide an overview of your skills, technologies, and professional expertise"
                  height={120}
                />
                <p className="text-xs text-gray-500">
                  Use formatting to organize your skills by category and highlight your expertise areas.
                </p>
              </div>
              
              {/* Technical Skills */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Technical Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.technicalSkills.map((skill, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 px-2 py-1">
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('technicalSkills', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="technicalSkill"
                    type="text"
                    placeholder="Add a technical skill"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        handleArrayField('technicalSkills', input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('technicalSkill') as HTMLInputElement;
                      handleArrayField('technicalSkills', input.value);
                      input.value = '';
                    }}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">E.g. JavaScript, Python, AWS, React, Docker, etc.</p>
              </div>
              
              {/* Soft Skills */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Soft Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.softSkills.map((skill, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 px-2 py-1">
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('softSkills', index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="softSkill"
                    type="text"
                    placeholder="Add a soft skill"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        handleArrayField('softSkills', input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('softSkill') as HTMLInputElement;
                      handleArrayField('softSkills', input.value);
                      input.value = '';
                    }}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">E.g. Communication, Leadership, Problem-solving, etc.</p>
              </div>
              
              {/* Certifications */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Certifications</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 px-2 py-1">
                      {cert}
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('certifications', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="certification"
                    type="text"
                    placeholder="Add a certification"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        handleArrayField('certifications', input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('certification') as HTMLInputElement;
                      handleArrayField('certifications', input.value);
                      input.value = '';
                    }}
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">E.g. AWS Certified Developer, PMP, CISSP, etc.</p>
              </div>
              
              {/* Languages */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Languages</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.languages.map((lang, index) => (
                    <Badge key={index} className="bg-amber-100 text-amber-800 px-2 py-1">
                      {lang} {formData.languageProficiencies[index] ? `(${formData.languageProficiencies[index]})` : ''}
                      <button 
                        type="button" 
                        onClick={() => {
                          removeArrayItem('languages', index);
                          removeArrayItem('languageProficiencies', index);
                        }}
                        className="ml-2 text-amber-600 hover:text-amber-800"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="language"
                    type="text"
                    placeholder="Language"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm flex-1"
                  />
                  <select
                    id="proficiency"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const langInput = document.getElementById('language') as HTMLInputElement;
                      const profInput = document.getElementById('proficiency') as HTMLSelectElement;
                      if (langInput.value) {
                        handleArrayField('languages', langInput.value);
                        handleArrayField('languageProficiencies', profInput.value);
                        langInput.value = '';
                      }
                    }}
                    className="px-3 py-2 bg-amber-100 text-amber-700 rounded-md text-sm hover:bg-amber-200"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">E.g. English (Native), Spanish (Fluent), etc.</p>
              </div>

              <div className="flex justify-between pt-4">
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
          
          {formStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
                Job Preferences
              </h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="preferredJobTypes">
                    Preferred Job Types <span className="text-red-500">*</span>
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
                  <label className="text-sm font-medium" htmlFor="remoteWorkPreference">
                    Remote Work Preference
                  </label>
                  <select
                    id="remoteWorkPreference"
                    name="remoteWorkPreference"
                    value={formData.remoteWorkPreference}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="ON_SITE">On-site only</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="REMOTE">Remote only</option>
                    <option value="FLEXIBLE">Flexible</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="desiredSalary">
                    Desired Salary
                  </label>
                  <div className="flex">
                    <select
                      id="salaryCurrency"
                      name="salaryCurrency"
                      value={formData.salaryCurrency}
                      onChange={handleChange}
                      className="rounded-l-md border border-r-0 border-gray-300 px-3 py-2 text-sm w-20"
                    >
                      <option value="USD">$</option>
                      <option value="EUR">€</option>
                      <option value="GBP">£</option>
                      <option value="JPY">¥</option>
                      <option value="AUD">A$</option>
                      <option value="CAD">C$</option>
                    </select>
                    <input
                      id="desiredSalary"
                      name="desiredSalary"
                      type="text"
                      value={formData.desiredSalary}
                      onChange={handleChange}
                      className="w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="e.g. 75,000 - 90,000"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="noticePeriod">
                    Notice Period
                  </label>
                  <select
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select notice period</option>
                    <option value="IMMEDIATE">Available immediately</option>
                    <option value="ONE_WEEK">1 week</option>
                    <option value="TWO_WEEKS">2 weeks</option>
                    <option value="ONE_MONTH">1 month</option>
                    <option value="TWO_MONTHS">2 months</option>
                    <option value="THREE_MONTHS">3 months</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center mb-2">
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
                
                {formData.willingToRelocate && (
                  <div className="ml-6 mt-2">
                    <label className="text-sm font-medium">Preferred Locations</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.preferredLocations.map((location, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 px-2 py-1">
                          {location}
                          <button 
                            type="button" 
                            onClick={() => removeArrayItem('preferredLocations', index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        id="preferredLocation"
                        type="text"
                        placeholder="Add a location"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            handleArrayField('preferredLocations', input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('preferredLocation') as HTMLInputElement;
                          handleArrayField('preferredLocations', input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">E.g. New York, London, Remote USA, etc.</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center mb-2">
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
                
                {formData.visaSponsorshipRequired && (
                  <div className="ml-6 mt-2">
                    <label className="text-sm font-medium" htmlFor="workAuthorizationStatus">
                      Current Work Authorization Status
                    </label>
                    <select
                      id="workAuthorizationStatus"
                      name="workAuthorizationStatus"
                      value={formData.workAuthorizationStatus}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mt-1"
                    >
                      <option value="">Select status</option>
                      <option value="CITIZEN">Citizen</option>
                      <option value="PERMANENT_RESIDENT">Permanent Resident</option>
                      <option value="WORK_VISA">Work Visa</option>
                      <option value="STUDENT_VISA">Student Visa</option>
                      <option value="NO_AUTHORIZATION">No Work Authorization</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-4">
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
          
          {formStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <Globe className="mr-2 h-5 w-5 text-blue-500" />
                Online Presence & Links
              </h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="linkedInProfile">
                    LinkedIn Profile URL
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Linkedin className="h-4 w-4" />
                    </span>
                    <input
                      id="linkedInProfile"
                      name="linkedInProfile"
                      type="url"
                      value={formData.linkedInProfile}
                      onChange={handleChange}
                      className="w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="portfolioUrl">
                    Portfolio or Website URL
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <Globe className="h-4 w-4" />
                    </span>
                    <input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                      className="w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="yourwebsite.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="githubProfile">
                    GitHub Profile
                  </label>
                  <input
                    id="githubProfile"
                    name="githubProfile"
                    type="url"
                    value={formData.githubProfile}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="github.com/yourusername"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="stackOverflowProfile">
                    Stack Overflow Profile
                  </label>
                  <input
                    id="stackOverflowProfile"
                    name="stackOverflowProfile"
                    type="url"
                    value={formData.stackOverflowProfile}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="stackoverflow.com/users/123456/username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Key Achievements</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.achievements.map((achievement, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 px-2 py-1">
                      {achievement}
                      <button 
                        type="button" 
                        onClick={() => removeArrayItem('achievements', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id="achievement"
                    type="text"
                    placeholder="Add an achievement"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        handleArrayField('achievements', input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('achievement') as HTMLInputElement;
                      handleArrayField('achievements', input.value);
                      input.value = '';
                    }}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">E.g. "Led team to deliver project 2 weeks ahead of schedule", "Increased revenue by 20%", etc.</p>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="text-blue-800 font-medium mb-2">Profile Submission</h4>
                <p className="text-sm text-blue-700 mb-4">
                  You're about to create a detailed job seeker profile. This information will help you:
                </p>
                <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1 mb-4">
                  <li>Apply to jobs with a single click</li>
                  <li>Get matched with relevant opportunities</li>
                  <li>Stand out to employers with a complete profile</li>
                  <li>Have your information securely stored for future applications</li>
                </ul>
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
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Review Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Step 5: Review & Submit */}
          {formStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-blue-500" />
                Review & Submit
              </h3>
              
              <div className="space-y-6 text-sm">
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-base mb-3">Personal Information</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-gray-500">Full Name</dt>
                      <dd>{formData.fullName}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Professional Title</dt>
                      <dd>{formData.title}</dd>
                    </div>
                    {formData.phoneNumber && (
                      <div>
                        <dt className="text-gray-500">Phone</dt>
                        <dd>{formData.phoneNumber}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-gray-500">Location</dt>
                      <dd>{formData.location}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-base mb-3">Career Preferences</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-gray-500">Job Types</dt>
                      <dd>{formData.preferredJobTypes.join(', ')}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Desired Salary</dt>
                      <dd>{formData.desiredSalary}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Willing to Relocate</dt>
                      <dd>{formData.willingToRelocate ? 'Yes' : 'No'}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Visa Sponsorship Required</dt>
                      <dd>{formData.visaSponsorshipRequired ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-base mb-3">Skills & Experience</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3">
                    <div>
                      <dt className="text-gray-500">Skills Overview</dt>
                      <dd className="whitespace-pre-line">{formData.skillsAndExperience}</dd>
                    </div>
                    
                    {formData.technicalSkills?.length > 0 && (
                      <div>
                        <dt className="text-gray-500">Technical Skills</dt>
                        <dd className="flex flex-wrap gap-2 mt-1">
                          {formData.technicalSkills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                              {skill}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                    
                    {formData.languages?.length > 0 && (
                      <div>
                        <dt className="text-gray-500">Languages</dt>
                        <dd className="flex flex-wrap gap-2 mt-1">
                          {formData.languages.map((lang, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                              {lang}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-base mb-3">Online Presence</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    {formData.linkedInProfile && (
                      <div>
                        <dt className="text-gray-500">LinkedIn</dt>
                        <dd className="truncate">
                          <a href={formData.linkedInProfile} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {formData.linkedInProfile}
                          </a>
                        </dd>
                      </div>
                    )}
                    {formData.portfolioUrl && (
                      <div>
                        <dt className="text-gray-500">Portfolio</dt>
                        <dd className="truncate">
                          <a href={formData.portfolioUrl} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline">
                            {formData.portfolioUrl}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
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
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Submit Profile
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
