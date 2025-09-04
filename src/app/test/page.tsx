"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Briefcase, Cog, FileCheck, Server } from "lucide-react";

export default function TestPage() {
  const { data: session } = useSession();

  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-gray-600">You need to be an admin to access this testing page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Testing Dashboard
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
            Test various features of the application
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                Test Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-6">
                Create test companies and users for testing purposes
              </p>
              <Link
                href="/test-setup"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Setup
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Employee Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-6">
                Test the employee onboarding workflow
              </p>
              <Link
                href="/test-onboarding"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Test Onboarding
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-500" />
                Onboarding Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-6">
                Go directly to the onboarding forms
              </p>
              <Link
                href="/onboarding"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Onboarding Forms
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
