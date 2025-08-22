"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MultiSelect } from "~/components/ui/multi-select";
import { Switch } from "~/components/ui/switch";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { toast } from "sonner";

// Form schema for matching preferences
const formSchema = z.object({
  jobRoles: z.array(z.string()).min(1, "Select at least one job role"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  industries: z.array(z.string()).min(1, "Select at least one industry"),
  locations: z.array(z.string()),
  remotePreference: z.boolean().default(false),
  salaryRange: z.array(z.number()).length(2),
  experienceLevels: z.array(z.string()).min(1, "Select at least one experience level"),
  employmentTypes: z.array(z.string()).min(1, "Select at least one employment type"),
  visaSponsorshipNeeded: z.boolean().default(true),
  relocationWillingness: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function MatchingPreferencesPage() {
  // Get current user's matching preferences
  const { data: preferences, isLoading } = api.matching.getUserMatchingPreferences.useQuery();
  
  const updatePreferences = api.matching.updateMatchingPreferences.useMutation({
    onSuccess: () => {
      toast.success("Matching preferences updated successfully!");
    },
    onError: (error) => {
      toast.error(`Error updating preferences: ${error.message}`);
    },
  });

  // Sample data for dropdowns
  const jobRoleOptions = [
    { label: "Software Engineer", value: "software-engineer" },
    { label: "Frontend Developer", value: "frontend-developer" },
    { label: "Backend Developer", value: "backend-developer" },
    { label: "Full Stack Developer", value: "fullstack-developer" },
    { label: "DevOps Engineer", value: "devops-engineer" },
    { label: "Data Scientist", value: "data-scientist" },
    { label: "Machine Learning Engineer", value: "ml-engineer" },
    { label: "Product Manager", value: "product-manager" },
    { label: "UI/UX Designer", value: "ui-ux-designer" },
    { label: "QA Engineer", value: "qa-engineer" },
  ];
  
  const skillOptions = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "React", value: "react" },
    { label: "Node.js", value: "nodejs" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "AWS", value: "aws" },
    { label: "Docker", value: "docker" },
    { label: "Kubernetes", value: "kubernetes" },
    { label: "SQL", value: "sql" },
    { label: "NoSQL", value: "nosql" },
    { label: "GraphQL", value: "graphql" },
    { label: "REST API", value: "rest-api" },
    { label: "CSS", value: "css" },
    { label: "HTML", value: "html" },
  ];
  
  const industryOptions = [
    { label: "Technology", value: "technology" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Finance", value: "finance" },
    { label: "Education", value: "education" },
    { label: "E-commerce", value: "ecommerce" },
    { label: "Gaming", value: "gaming" },
    { label: "Media", value: "media" },
    { label: "Transportation", value: "transportation" },
    { label: "Energy", value: "energy" },
    { label: "Consulting", value: "consulting" },
  ];
  
  const locationOptions = [
    { label: "United States", value: "united-states" },
    { label: "United Kingdom", value: "united-kingdom" },
    { label: "Canada", value: "canada" },
    { label: "Germany", value: "germany" },
    { label: "Australia", value: "australia" },
    { label: "Netherlands", value: "netherlands" },
    { label: "Switzerland", value: "switzerland" },
    { label: "Singapore", value: "singapore" },
    { label: "Japan", value: "japan" },
    { label: "Sweden", value: "sweden" },
  ];
  
  const experienceLevelOptions = [
    { label: "Entry Level", value: "entry" },
    { label: "Junior", value: "junior" },
    { label: "Mid-Level", value: "mid" },
    { label: "Senior", value: "senior" },
    { label: "Lead", value: "lead" },
    { label: "Manager", value: "manager" },
    { label: "Director", value: "director" },
    { label: "Executive", value: "executive" },
  ];
  
  const employmentTypeOptions = [
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Freelance", value: "freelance" },
    { label: "Internship", value: "internship" },
  ];

  // Form setup
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRoles: [],
      skills: [],
      industries: [],
      locations: [],
      remotePreference: false,
      salaryRange: [50000, 150000],
      experienceLevels: [],
      employmentTypes: [],
      visaSponsorshipNeeded: true,
      relocationWillingness: true,
    }
  });

  // Set form values when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setValue('jobRoles', preferences.jobRoles || []);
      setValue('skills', preferences.skills || []);
      setValue('industries', preferences.industries || []);
      setValue('locations', preferences.locations || []);
      setValue('remotePreference', preferences.remotePreference);
      setValue('salaryRange', [preferences.salaryMin || 50000, preferences.salaryMax || 150000]);
      setValue('experienceLevels', preferences.experienceLevels || []);
      setValue('employmentTypes', preferences.employmentTypes || []);
      setValue('visaSponsorshipNeeded', preferences.visaSponsorshipNeeded);
      setValue('relocationWillingness', preferences.relocationWillingness);
    }
  }, [preferences, setValue]);

  // Watch form values for live updates
  const watchedSalaryRange = watch('salaryRange');

  // Form submission
  const onSubmit = (data: FormValues) => {
    updatePreferences.mutate({
      jobRoles: data.jobRoles,
      skills: data.skills,
      industries: data.industries,
      locations: data.locations,
      remotePreference: data.remotePreference,
      salaryMin: data.salaryRange[0],
      salaryMax: data.salaryRange[1],
      experienceLevels: data.experienceLevels,
      employmentTypes: data.employmentTypes,
      visaSponsorshipNeeded: data.visaSponsorshipNeeded,
      relocationWillingness: data.relocationWillingness,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <p>Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Matching Preferences</h1>
        
        <div className="mb-6">
          <p className="text-muted-foreground">
            Customize your job matching preferences to get more relevant job recommendations.
            Our matching algorithm uses these preferences to find the best job opportunities for you.
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Career Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Career Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Job Roles</Label>
                <MultiSelect
                  options={jobRoleOptions}
                  value={watch('jobRoles').map(role => ({ label: jobRoleOptions.find(option => option.value === role)?.label || role, value: role }))}
                  onChange={(selected) => setValue('jobRoles', selected.map(item => item.value))}
                  placeholder="Select job roles"
                />
                {errors.jobRoles && (
                  <p className="text-sm text-red-500">{errors.jobRoles.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <MultiSelect
                  options={experienceLevelOptions}
                  value={watch('experienceLevels').map(level => ({ label: experienceLevelOptions.find(option => option.value === level)?.label || level, value: level }))}
                  onChange={(selected) => setValue('experienceLevels', selected.map(item => item.value))}
                  placeholder="Select experience levels"
                />
                {errors.experienceLevels && (
                  <p className="text-sm text-red-500">{errors.experienceLevels.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Employment Types</Label>
                <MultiSelect
                  options={employmentTypeOptions}
                  value={watch('employmentTypes').map(type => ({ label: employmentTypeOptions.find(option => option.value === type)?.label || type, value: type }))}
                  onChange={(selected) => setValue('employmentTypes', selected.map(item => item.value))}
                  placeholder="Select employment types"
                />
                {errors.employmentTypes && (
                  <p className="text-sm text-red-500">{errors.employmentTypes.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Salary Range (USD)</Label>
                <div className="pt-6 pb-2">
                  <Slider
                    min={30000}
                    max={300000}
                    step={5000}
                    value={watchedSalaryRange}
                    onValueChange={(value) => setValue('salaryRange', value)}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${watchedSalaryRange[0].toLocaleString()}</span>
                  <span>${watchedSalaryRange[1].toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills and Industries */}
          <Card>
            <CardHeader>
              <CardTitle>Skills and Industries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Skills</Label>
                <MultiSelect
                  options={skillOptions}
                  value={watch('skills').map(skill => ({ label: skillOptions.find(option => option.value === skill)?.label || skill, value: skill }))}
                  onChange={(selected) => setValue('skills', selected.map(item => item.value))}
                  placeholder="Select your skills"
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Industries</Label>
                <MultiSelect
                  options={industryOptions}
                  value={watch('industries').map(industry => ({ label: industryOptions.find(option => option.value === industry)?.label || industry, value: industry }))}
                  onChange={(selected) => setValue('industries', selected.map(item => item.value))}
                  placeholder="Select preferred industries"
                />
                {errors.industries && (
                  <p className="text-sm text-red-500">{errors.industries.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Location Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Preferred Locations</Label>
                <MultiSelect
                  options={locationOptions}
                  value={watch('locations').map(location => ({ label: locationOptions.find(option => option.value === location)?.label || location, value: location }))}
                  onChange={(selected) => setValue('locations', selected.map(item => item.value))}
                  placeholder="Select preferred locations"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remote-preference">Remote Work Preference</Label>
                  <Switch
                    id="remote-preference"
                    checked={watch('remotePreference')}
                    onCheckedChange={(checked) => setValue('remotePreference', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable if you prefer remote positions
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="relocation-willingness">Willing to Relocate</Label>
                  <Switch
                    id="relocation-willingness"
                    checked={watch('relocationWillingness')}
                    onCheckedChange={(checked) => setValue('relocationWillingness', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable if you are open to relocating for a job
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="visa-sponsorship">Need Visa Sponsorship</Label>
                  <Switch
                    id="visa-sponsorship"
                    checked={watch('visaSponsorshipNeeded')}
                    onCheckedChange={(checked) => setValue('visaSponsorshipNeeded', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable if you require visa sponsorship
                </p>
              </div>
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end px-0">
            <Button 
              type="submit" 
              disabled={updatePreferences.isLoading}
              className="w-full md:w-auto"
            >
              {updatePreferences.isLoading ? 'Updating...' : 'Save Preferences'}
            </Button>
          </CardFooter>
        </form>
      </div>
    </div>
  );
}
