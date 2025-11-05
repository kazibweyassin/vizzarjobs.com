'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { FileText, Edit, Trash2, Download, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

interface Resume {
  id: string;
  title: string;
  template: string;
  atsScore: number | null;
  createdAt: string;
  updatedAt: string;
  downloadCount?: number;
}

export default function ResumesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile/resumes');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchResumes();
    }
  }, [session]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resume/list');
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResumes(resumes.filter((r) => r.id !== id));
      } else {
        alert('Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (resumeId: string) => {
    // Check if already paid
    const checkResponse = await fetch(`/api/resume/${resumeId}/check-payment`);
    if (checkResponse.ok) {
      const { paid } = await checkResponse.json();
      if (paid) {
        // Direct download
        window.location.href = `/api/resume/generate-pdf?resumeId=${resumeId}`;
      } else {
        // Show payment modal
        router.push(`/tools/resume-builder?id=${resumeId}&download=true`);
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resumes...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-gray-600 mt-2">Manage your saved resumes</p>
            </div>
            <Link href="/tools/resume-builder">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Resume
              </Button>
            </Link>
          </div>
        </div>

        {resumes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-6">Create your first ATS-optimized resume</p>
              <Link href="/tools/resume-builder">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{resume.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{resume.template}</Badge>
                        {resume.atsScore !== null && (
                          <Badge variant={resume.atsScore >= 80 ? 'default' : 'secondary'}>
                            ATS: {resume.atsScore}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/tools/resume-builder?id=${resume.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(resume.id)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resume.id)}
                      disabled={deleting === resume.id}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

