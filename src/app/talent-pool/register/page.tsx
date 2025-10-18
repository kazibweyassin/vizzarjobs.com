"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { FileUpload } from '~/components/ui/file-upload';
import { api } from '~/trpc/react';
import { Loader2, CheckCircle, XCircle, ArrowRight, ArrowLeft, User, Briefcase, Target, FileText } from 'lucide-react';
import { EducationLevel } from '@prisma/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define the schema for the form
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  country: z.string().min(1, "Country of residence is required"),
  profession: z.string().min(1, "Profession/Job Title is required"),
  skills: z.string().min(1, "Skills are required (comma-separated)"),
  yearsOfExperience: z.string().min(1, "Years of experience is required").transform(Number),
  educationLevel: z.nativeEnum(EducationLevel, {
    errorMap: () => ({ message: "Education level is required" }),
  }),
  preferredDestination: z.string().optional(),
  needsVisaSponsorship: z.boolean().default(false),
  cvFilePath: z.string().optional(),
  cvPublicId: z.string().optional(),
  cvSecureUrl: z.string().optional(),
  jobAlerts: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: 2,
    title: "Professional Details",
    description: "Your career background",
    icon: Briefcase,
  },
  {
    id: 3,
    title: "Skills & Preferences",
    description: "What you're looking for",
    icon: Target,
  },
  {
    id: 4,
    title: "CV Upload",
    description: "Upload your resume",
    icon: FileText,
  },
];

export default function MultiStepCandidateRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [cvUploadError, setCvUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      country: '',
      profession: '',
      skills: '',
      yearsOfExperience: 0,
      educationLevel: EducationLevel.BACHELOR,
      preferredDestination: '',
      needsVisaSponsorship: false,
      cvFilePath: '',
      cvPublicId: '',
      cvSecureUrl: '',
      jobAlerts: true,
    },
  });

  const createCandidate = api.candidatePool.create.useMutation({
    onSuccess: () => {
      setSubmissionStatus('success');
      setSubmissionMessage("✅ Thank you for joining VizzarJobs Talent Pool! We'll contact you when matching opportunities arise.");
      reset();
      setTimeout(() => {
        router.push('/talent-pool');
      }, 5000);
    },
    onError: (error) => {
      setSubmissionStatus('error');
      setSubmissionMessage(`Failed to register: ${error.message}`);
    },
  });

  const onSubmit = async (data: FormData) => {
    if (cvUploadError) {
      setSubmissionStatus('error');
      setSubmissionMessage('Please fix the CV upload error before submitting.');
      return;
    }

    try {
      await createCandidate.mutateAsync({
        ...data,
        skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
        preferredDestination: data.preferredDestination?.split(',').map(s => s.trim()).filter(Boolean) || [],
      });
    } catch (error) {
      // Error handled by onError callback
    }
  };

  const handleCvFileUpload = (filePath: string) => {
    setValue('cvFilePath', filePath);
    setCvUploadError(null);
  };

  const handleCvUploadError = (message: string) => {
    setCvUploadError(message);
    setValue('cvFilePath', '');
  };

  const currentCvFilePath = watch('cvFilePath');

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['fullName', 'email', 'country'];
        break;
      case 2:
        fieldsToValidate = ['profession', 'yearsOfExperience', 'educationLevel'];
        break;
      case 3:
        fieldsToValidate = ['skills'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (submissionStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-opal-2 to-opal-1 p-4">
        <Card className="w-full max-w-md p-6 text-center shadow-lg">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Registration Successful!</CardTitle>
          <CardDescription className="text-gray-600 mb-4">{submissionMessage}</CardDescription>
          <Link href="/talent-pool">
            <Button className="w-full">
              Go to Talent Pool <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-8 px-4 bg-gradient-to-br from-white via-opal-2 to-opal-1">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-kale mb-2">Join Our Talent Pool</h1>
          <p className="text-lg text-grey-green">
            Connect with global opportunities and let employers find you
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isCompleted 
                      ? 'bg-emerald text-white' 
                      : isActive 
                        ? 'bg-kale text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${isActive ? 'text-kale' : isCompleted ? 'text-emerald' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="shadow-xl border-light-green">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-kale">
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription className="text-center text-grey-green">
              {steps[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" {...register('fullName')} placeholder="John Doe" />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register('email')} placeholder="john.doe@example.com" />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                      <Input id="phoneNumber" {...register('phoneNumber')} placeholder="+256 700 123 456" />
                      {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="country">Country of Residence</Label>
                      <Input id="country" {...register('country')} placeholder="Uganda" />
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="profession">Profession / Job Title</Label>
                      <Input id="profession" {...register('profession')} placeholder="e.g., Software Engineer" />
                      {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Input id="yearsOfExperience" type="number" {...register('yearsOfExperience')} placeholder="5" min="0" />
                      {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="educationLevel">Education Level</Label>
                      <Select onValueChange={(value) => setValue('educationLevel', value as EducationLevel)} defaultValue={watch('educationLevel')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(EducationLevel).map((level) => (
                            <SelectItem key={level} value={level}>
                              {level.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.educationLevel && <p className="text-red-500 text-sm mt-1">{errors.educationLevel.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Skills & Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="skills">Skills (Comma-separated)</Label>
                    <Textarea id="skills" {...register('skills')} placeholder="e.g., React, Node.js, AWS, Python" rows={3} />
                    {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="preferredDestination">Preferred Destination (Comma-separated)</Label>
                    <Input id="preferredDestination" {...register('preferredDestination')} placeholder="e.g., Canada, Germany, USA" />
                    {errors.preferredDestination && <p className="text-red-500 text-sm mt-1">{errors.preferredDestination.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="needsVisaSponsorship"
                        checked={watch('needsVisaSponsorship')}
                        onCheckedChange={(checked) => setValue('needsVisaSponsorship', checked as boolean)}
                      />
                      <Label htmlFor="needsVisaSponsorship" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I need visa sponsorship / relocation support
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="jobAlerts"
                        checked={watch('jobAlerts')}
                        onCheckedChange={(checked) => setValue('jobAlerts', checked as boolean)}
                      />
                      <Label htmlFor="jobAlerts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Send me job alerts for matching opportunities
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: CV Upload */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <FileUpload
                      onFileUpload={handleCvFileUpload}
                      onError={handleCvUploadError}
                      currentFilePath={currentCvFilePath}
                      label="Upload your CV (PDF, max 5MB)"
                      disabled={isSubmitting}
                    />
                    {cvUploadError && <p className="text-red-500 text-sm mt-1">{cvUploadError}</p>}
                    {errors.cvFilePath && <p className="text-red-500 text-sm mt-1">{errors.cvFilePath.message}</p>}
                  </div>
                  
                  <div className="bg-opal-1 p-4 rounded-lg">
                    <h3 className="font-semibold text-kale mb-2">Review Your Information</h3>
                    <div className="text-sm text-grey-green space-y-1">
                      <p><strong>Name:</strong> {watch('fullName')}</p>
                      <p><strong>Email:</strong> {watch('email')}</p>
                      <p><strong>Profession:</strong> {watch('profession')}</p>
                      <p><strong>Experience:</strong> {watch('yearsOfExperience')} years</p>
                      <p><strong>Skills:</strong> {watch('skills')}</p>
                      <p><strong>Visa Sponsorship:</strong> {watch('needsVisaSponsorship') ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting || createCandidate.isLoading}>
                    {isSubmitting || createCandidate.isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Join Talent Pool
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {submissionStatus === 'error' && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 justify-center">
                  <XCircle className="h-4 w-4" /> {submissionMessage}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}