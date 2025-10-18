"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Checkbox } from '~/components/ui/checkbox';
import { FileUpload } from '~/components/ui/file-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Badge } from '~/components/ui/badge';
import { X, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { EducationLevel } from '@prisma/client';

const EDUCATION_LEVELS = [
  { value: 'HIGH_SCHOOL', label: 'High School' },
  { value: 'ASSOCIATE', label: 'Associate Degree' },
  { value: 'BACHELOR', label: 'Bachelor\'s Degree' },
  { value: 'MASTER', label: 'Master\'s Degree' },
  { value: 'DOCTORATE', label: 'Doctorate' },
  { value: 'CERTIFICATION', label: 'Professional Certification' },
  { value: 'OTHER', label: 'Other' },
];

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C#', 'C++',
  'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Git', 'Linux', 'Agile', 'Scrum'
];

const COMMON_DESTINATIONS = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'Netherlands', 'Australia', 'New Zealand',
  'Singapore', 'Japan', 'South Korea', 'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Ireland',
  'France', 'Spain', 'Italy', 'Portugal', 'Poland', 'Czech Republic', 'Austria', 'Belgium'
];

export default function CandidateRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    country: '',
    profession: '',
    skills: [] as string[],
    yearsOfExperience: 0,
    educationLevel: '' as EducationLevel,
    preferredDestination: [] as string[],
    needsVisaSponsorship: false,
    jobAlerts: true,
  });
  const [cvFilePath, setCvFilePath] = useState<string>('');
  const [cvPublicId, setCvPublicId] = useState<string>('');
  const [cvSecureUrl, setCvSecureUrl] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createCandidateMutation = api.candidatePool.create.useMutation({
    onSuccess: () => {
      setSubmitSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    },
    onError: (error) => {
      setSubmitError(error.message);
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addDestination = (destination: string) => {
    if (destination.trim() && !formData.preferredDestination.includes(destination.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredDestination: [...prev.preferredDestination, destination.trim()]
      }));
    }
    setDestinationInput('');
  };

  const removeDestination = (destinationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      preferredDestination: prev.preferredDestination.filter(dest => dest !== destinationToRemove)
    }));
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleFileUploadComplete = (filePath: string) => {
    setCvFilePath(filePath);
    // Extract public ID and secure URL from the response
    // The API should return these in the response
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createCandidateMutation.mutateAsync({
        ...formData,
        cvFilePath: cvFilePath || undefined,
        cvPublicId: cvPublicId || undefined,
        cvSecureUrl: cvSecureUrl || undefined,
      });
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-green-700">Registration Successful!</h2>
                <p className="text-gray-600 mt-2">
                  ✅ Thank you for joining VizzarJobs Talent Pool! We'll contact you when matching opportunities arise.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Redirecting to homepage in 3 seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
        <div className="min-h-screen relative py-8 px-4 bg-gradient-to-br from-white via-opal-2 to-opal-1">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-kale mb-2">Join Our Talent Pool</h1>
          <p className="text-lg text-grey-green">
            Connect with global opportunities and let employers find you
          </p>
        </div>

        <Card className="shadow-xl border-light-green">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-kale">Candidate Registration</CardTitle>
            <CardDescription className="text-center text-grey-green">
              Fill out the form below to join our talent pool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country of Residence *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="e.g., United States, Canada, UK"
                    required
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession / Job Title *</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                    placeholder="e.g., Software Engineer, Data Scientist"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="educationLevel">Education Level *</Label>
                <Select
                  value={formData.educationLevel}
                  onValueChange={(value) => handleInputChange('educationLevel', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSkill(skillInput)}
                    disabled={!skillInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {COMMON_SKILLS.slice(0, 10).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Destinations */}
              <div className="space-y-2">
                <Label>Preferred Destinations</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.preferredDestination.map((destination) => (
                    <Badge key={destination} variant="secondary" className="flex items-center gap-1">
                      {destination}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeDestination(destination)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="Add a destination"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addDestination(destinationInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addDestination(destinationInput)}
                    disabled={!destinationInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {COMMON_DESTINATIONS.slice(0, 8).map((destination) => (
                    <Badge
                      key={destination}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => addDestination(destination)}
                    >
                      {destination}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CV Upload */}
              <div className="space-y-2">
                <Label>CV Upload (Optional)</Label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onUploadComplete={handleFileUploadComplete}
                />
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needsVisaSponsorship"
                    checked={formData.needsVisaSponsorship}
                    onCheckedChange={(checked) => handleInputChange('needsVisaSponsorship', checked)}
                  />
                  <Label htmlFor="needsVisaSponsorship">
                    I need visa sponsorship to work in my preferred destinations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="jobAlerts"
                    checked={formData.jobAlerts}
                    onCheckedChange={(checked) => handleInputChange('jobAlerts', checked)}
                  />
                  <Label htmlFor="jobAlerts">
                    Send me job alerts and opportunities
                  </Label>
                </div>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Join Talent Pool'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
