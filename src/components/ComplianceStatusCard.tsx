import { Shield, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import Link from 'next/link';

export interface StatusStepProps {
  step: string;
  status: 'complete' | 'in-progress' | 'pending';
  date?: string;
  description: string;
}

export function ComplianceStatusCard() {
  const steps: StatusStepProps[] = [
    {
      step: "LMBP Submitted",
      status: "complete",
      date: "Oct 15, 2025",
      description: "Labour Market Benefits Plan submitted to ESDC"
    },
    {
      step: "Employer Compliance Check",
      status: "complete",
      date: "Oct 16, 2025",
      description: "Employer verified as eligible Category A company"
    },
    {
      step: "Offer Verification",
      status: "in-progress",
      description: "Verifying employment terms match LMBP requirements"
    },
    {
      step: "Work Permit Approval",
      status: "pending",
      description: "Expected approval within 14 days of LMBP submission"
    }
  ];

  const daysRemaining = 10; // Days remaining in the GTS process
  const estimatedCompletionDate = "Oct 25, 2025";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>GTS Compliance Status</CardTitle>
              <CardDescription>Global Talent Stream Fast Track</CardDescription>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
            {daysRemaining} Days Remaining
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start">
              <div className="absolute left-3 top-0 -bottom-8 w-px bg-gray-200" />
              
              <div className={`rounded-full p-1 mr-4 ${
                step.status === 'complete' ? 'bg-green-100 text-green-600' :
                step.status === 'in-progress' ? 'bg-amber-100 text-amber-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {step.status === 'complete' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : step.status === 'in-progress' ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${
                    step.status === 'complete' ? 'text-green-700' :
                    step.status === 'in-progress' ? 'text-amber-700' :
                    'text-gray-500'
                  }`}>
                    {step.step}
                  </h4>
                  {step.date && (
                    <span className="text-sm text-gray-500">{step.date}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Estimated Completion</p>
              <p className="text-gray-600 text-sm">Work permit approval</p>
            </div>
            <div className="text-lg font-semibold text-blue-700">{estimatedCompletionDate}</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 flex justify-between">
        <Link href="/dashboard/compliance/details" className="text-blue-600 font-medium hover:underline text-sm">
          View Full Compliance Details
        </Link>
        <Link href="/dashboard/compliance/documents" className="text-blue-600 font-medium hover:underline text-sm">
          Download Documentation
        </Link>
      </CardFooter>
    </Card>
  );
}