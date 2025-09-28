"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Github, 
  Chrome, 
  MessageCircle, 
  ArrowLeft,
  Users,
  Building2,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

const providerIcons = {
  google: Chrome,
  github: Github,
  discord: MessageCircle,
};

const providerColors = {
  google: "bg-red-500 hover:bg-red-600",
  github: "bg-gray-900 hover:bg-gray-800",
  discord: "bg-indigo-500 hover:bg-indigo-600",
};

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"JOB_SEEKER" | "EMPLOYER" | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const handleSignIn = async (providerId: string) => {
    if (!selectedRole) {
      // Show a more user-friendly message
      const roleSelection = document.querySelector('[data-role-selection]');
      if (roleSelection) {
        roleSelection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        roleSelection.classList.add('animate-pulse');
        setTimeout(() => roleSelection.classList.remove('animate-pulse'), 2000);
      }
      return;
    }
    
    setIsLoading(providerId);
    try {
      // Store the selected role in localStorage to use after sign in
      localStorage.setItem("selectedRole", selectedRole);
      await signIn(providerId, { callbackUrl: "/?roleUpdate=true" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
        {/* Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to VizzarJobs
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Welcome to VizzarJobs
            </CardTitle>
            <p className="text-slate-600 text-lg">
              Your gateway to global tech opportunities
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              80% of jobs offer visa sponsorship
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            {/* Role Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100" data-role-selection>
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-blue-600" />
                Choose your path:
              </h3>
              <div className="space-y-3 text-sm">
                <button
                  onClick={() => setSelectedRole("JOB_SEEKER")}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedRole === "JOB_SEEKER"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-blue-100 bg-white hover:border-blue-300 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === "JOB_SEEKER"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}>
                    {selectedRole === "JOB_SEEKER" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-slate-900">Job Seeker</span>
                    <p className="text-slate-600">Find visa-sponsored tech jobs worldwide</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedRole("EMPLOYER")}
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedRole === "EMPLOYER"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-green-100 bg-white hover:border-green-300 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === "EMPLOYER"
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}>
                    {selectedRole === "EMPLOYER" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-slate-900">Employer</span>
                    <p className="text-slate-600">Post jobs and hire global talent</p>
                  </div>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                You can update your role after signing in
              </p>
              {!selectedRole && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700 text-center">
                    ⚠️ Please select your role above to continue
                  </p>
                </div>
              )}
            </div>

            {/* Sign In Providers */}
            <div className="space-y-4">
              <h4 className="text-center text-slate-700 font-medium mb-4">Sign in with your preferred account</h4>
              {providers && Object.values(providers).map((provider) => {
                const IconComponent = providerIcons[provider.id as keyof typeof providerIcons];
                const colorClass = providerColors[provider.id as keyof typeof providerColors] || "bg-slate-600 hover:bg-slate-700";
                
                return (
                  <button
                    key={provider.name}
                    onClick={() => handleSignIn(provider.id)}
                    disabled={isLoading === provider.id || !selectedRole}
                    className={`w-full ${colorClass} text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-lg border-0 ${
                      !selectedRole ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                    {isLoading === provider.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      `Continue with ${provider.name}`
                    )}
                  </button>
                );
              })}
            </div>

            {/* Terms */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Why choose VizzarJobs?
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700"><strong>80% of jobs</strong> offer visa sponsorship</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-700"><strong>Global reach</strong> with opportunities worldwide</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-700"><strong>Connecting talent</strong> from Africa to the world</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-700"><strong>Verified companies</strong> and quality opportunities</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
