"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: Date | null;
  dueDate: Date | null;
}

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

interface OnboardingStepsProps {
  employeeData: {
    onboardingStatus: string;
    onboardingSteps: OnboardingStep[];
    documents: Document[];
  } | null;
}

export function OnboardingSteps({ employeeData }: OnboardingStepsProps) {
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [documentName, setDocumentName] = useState("");

  const updateStepMutation = api.users.updateOnboardingStep.useMutation({
    onError: (error) => {
      console.error("Failed to update step:", error);
    },
  });

  const uploadDocumentMutation = api.users.uploadDocument.useMutation({
    onError: (error) => {
      console.error("Failed to upload document:", error);
      setUploading(false);
    },
    onSuccess: () => {
      setDocumentName("");
      setDocumentType("");
      setUploading(false);
    },
  });

  if (!employeeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No onboarding data found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please start the employee onboarding process first.
          </p>
        </div>
      </div>
    );
  }

  const { onboardingStatus, onboardingSteps, documents } = employeeData;

  const handleToggleStep = async (stepId: string, completed: boolean) => {
    await updateStepMutation.mutate({
      stepId,
      completed,
    });
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // In a real implementation, you'd upload the file to a storage service first
    // For this example, we'll just simulate a successful upload with a fake URL
    const fakeUrl = `https://storage.example.com/documents/${documentName.replace(/\s/g, "-").toLowerCase()}-${Date.now()}.pdf`;

    await uploadDocumentMutation.mutate({
      name: documentName,
      type: documentType,
      url: fakeUrl,
    });
  };

  const getProgressPercentage = () => {
    if (onboardingSteps.length === 0) return 0;
    const completedSteps = onboardingSteps.filter((step) => step.completed).length;
    return Math.round((completedSteps / onboardingSteps.length) * 100);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Onboarding Progress</CardTitle>
              <CardDescription>
                Complete all steps to finish your onboarding
              </CardDescription>
            </div>
            <Badge
              className={`
                ${
                  onboardingStatus === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : onboardingStatus === "IN_PROGRESS"
                    ? "bg-[#0F2C4C]/8 text-[#0F2C4C]"
                    : "bg-amber-50 text-amber-700"
                }
              `}
            >
              {onboardingStatus === "COMPLETED"
                ? "Completed"
                : onboardingStatus === "IN_PROGRESS"
                ? "In Progress"
                : "Pending"}
            </Badge>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-amber-500 rounded-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
              <span className="ml-4 text-sm font-medium text-gray-700">
                {getProgressPercentage()}%
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ul className="space-y-6">
            {onboardingSteps.map((step) => (
              <li key={step.id} className="relative">
                <div
                  className={`
                    absolute left-3 top-5 -ml-px h-full w-0.5 
                    ${step.completed ? "bg-[#0F2C4C]" : "bg-gray-200"}
                  `}
                  aria-hidden="true"
                />
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span
                      className={`
                        relative z-10 flex h-6 w-6 items-center justify-center rounded-full 
                        ${
                          step.completed
                            ? "bg-[#0F2C4C] group-hover:bg-[#0F2C4C]/80"
                            : "bg-white border-2 border-gray-300 group-hover:border-gray-400"
                        }
                      `}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                      )}
                    </span>
                  </span>
                  <div className="ml-4 flex-1">
                    <div
                      className={`
                        flex flex-wrap items-center justify-between gap-x-2 text-sm 
                        ${step.completed ? "" : ""}
                      `}
                    >
                      <div>
                        <button
                          className={`
                            font-medium focus:outline-none 
                            ${step.completed ? "text-[#0F2C4C]" : "text-gray-700"}
                          `}
                          onClick={() => handleToggleStep(step.id, !step.completed)}
                        >
                          {step.title}
                        </button>
                      </div>
                      {step.completed ? (
                        <div className="whitespace-nowrap text-gray-500">
                          <Clock className="mr-1 inline-block h-3 w-3" />
                          <span>
                            {step.completedAt
                              ? new Date(step.completedAt).toLocaleDateString()
                              : "Completed"}
                          </span>
                        </div>
                      ) : step.dueDate ? (
                        <div className="whitespace-nowrap text-red-500">
                          <Clock className="mr-1 inline-block h-3 w-3" />
                          <span>
                            Due {new Date(step.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <p
                      className={`
                        text-sm 
                        ${step.completed ? "text-gray-500" : "text-gray-700"}
                      `}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Document Upload</CardTitle>
          <CardDescription>
            Upload required documents for your onboarding
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {documents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Documents
                </h3>
                <ul className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <li key={doc.id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.type}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleUploadDocument}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="documentName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Document Name
                  </label>
                  <input
                    type="text"
                    id="documentName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#0F2C4C] focus:outline-none focus:ring-1 focus:ring-[#0F2C4C]/20"
                    placeholder="e.g. Passport"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="documentType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Document Type
                  </label>
                  <select
                    id="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#0F2C4C] focus:outline-none focus:ring-1 focus:ring-[#0F2C4C]/20"
                    required
                  >
                    <option value="">Select document type</option>
                    <option value="Identification">Identification</option>
                    <option value="Work Authorization">Work Authorization</option>
                    <option value="Education Credentials">Education Credentials</option>
                    <option value="Banking Information">Banking Information</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="documentFile"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="documentFile"
                          className="relative cursor-pointer rounded-md font-medium text-[#0F2C4C] hover:text-[#0F2C4C]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#0F2C4C]/30"
                        >
                          <span>Upload a file</span>
                          <input
                            id="documentFile"
                            name="documentFile"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={uploading || !documentName || !documentType}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0F2C4C] hover:bg-[#0F2C4C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F2C4C]/30 disabled:bg-[#0F2C4C]/40 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
