"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  Download, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Building2,
  MapPin,
  DollarSign,
  Users,
  AlertCircle,
  Clock,
  Play,
  Calendar
} from "lucide-react";
import { api } from "~/trpc/react";

export default function ImportJobsPage() {
  const router = useRouter();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const importJobsMutation = api.jobs.importFromRemoteOK.useMutation({
    onSuccess: (data) => {
      setImportResult(data);
      setError(null);
      setIsImporting(false);
    },
    onError: (error) => {
      setError(error.message);
      setIsImporting(false);
    }
  });

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    setImportResult(null);
    
    try {
      await importJobsMutation.mutateAsync();
    } catch (error) {
      // Error is handled by onError callback
    }
  };

  const handleTestImport = async () => {
    setIsImporting(true);
    setError(null);
    setImportResult(null);
    
    try {
      const response = await fetch('/api/cron/test-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setImportResult(result.result);
        setError(null);
      } else {
        setError(result.error || 'Test import failed');
      }
    } catch (error) {
      setError('Failed to trigger test import');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import Jobs
          </CardTitle>
          <CardDescription>
            Automatically import jobs with visa sponsorship from external sources
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Automatic Import Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Calendar className="h-5 w-5" />
            Automatic Daily Import
          </CardTitle>
          <CardDescription className="text-blue-600">
            Jobs are automatically imported every day at 9:00 AM UTC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Daily Import: Active</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Running
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Next Import: Tomorrow 9:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-blue-600" />
                <span>Source: RemoteOK API</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Filter: Visa Sponsorship</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleTestImport}
                disabled={isImporting}
                variant="outline"
                size="sm"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Test Import Now
                  </>
                )}
              </Button>
              <Button 
                onClick={() => window.open('https://console.cron-job.org/', '_blank')}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Setup Cron Job
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* RemoteOK */}
        <Card className="border-2 hover:border-blue-300 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              RemoteOK
            </CardTitle>
            <CardDescription>
              Remote jobs with visa sponsorship and relocation support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">Remote</Badge>
                <Badge variant="secondary">Visa Sponsorship</Badge>
                <Badge variant="secondary">Tech Jobs</Badge>
              </div>
              <Button 
                onClick={handleImport}
                disabled={isImporting}
                className="w-full"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Import Jobs
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for future sources */}
        <Card className="border-2 border-gray-200 opacity-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              AngelList
            </CardTitle>
            <CardDescription>
              Startup jobs with relocation packages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <Button disabled className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Import Jobs
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 opacity-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              Stack Overflow
            </CardTitle>
            <CardDescription>
              Developer jobs with visa sponsorship
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <Button disabled className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Import Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              <span className="font-semibold">Import Failed</span>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Success Display */}
      {importResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Import Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                  <div className="text-sm text-green-700">Jobs Imported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{importResult.total}</div>
                  <div className="text-sm text-blue-700">Total Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{importResult.total - importResult.imported}</div>
                  <div className="text-sm text-gray-700">Skipped (Duplicates)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{importResult.errors?.length || 0}</div>
                  <div className="text-sm text-red-700">Errors</div>
                </div>
              </div>

              {/* Imported Jobs Preview */}
              {importResult.jobs && importResult.jobs.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Imported Jobs Preview:</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {importResult.jobs.slice(0, 10).map((job: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {job.company?.name || 'Unknown Company'}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                            {job.visaSponsorship && (
                              <Badge variant="secondary" className="text-xs">Visa Sponsorship</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {importResult.jobs.length > 10 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        ... and {importResult.jobs.length - 10} more jobs
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Errors Display */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Import Errors:
                  </h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {importResult.errors.map((error: any, index: number) => (
                      <div key={index} className="text-sm text-red-600 p-2 bg-red-100 rounded">
                        <strong>{error.job}</strong> at {error.company}: {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={() => router.push('/admin')} variant="outline">
                  Back to Admin
                </Button>
                <Button onClick={() => router.push('/jobs')}>
                  View All Jobs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">1</div>
              <div>Click "Import Jobs" to fetch jobs from RemoteOK API</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">2</div>
              <div>System automatically filters for jobs with visa sponsorship and relocation support</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">3</div>
              <div>Jobs are parsed and companies are created automatically</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">4</div>
              <div>Duplicate jobs are automatically skipped to prevent duplicates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}