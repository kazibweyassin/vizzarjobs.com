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
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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
  discord: "bg-blue-500 hover:bg-blue-600",
};

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"JOB_SEEKER" | "EMPLOYER" | null>(null);
  const [authMode, setAuthMode] = useState<"oauth" | "password">("oauth");
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

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

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading("credentials");
    setError("");

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(null);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setError("An error occurred during sign in");
      setIsLoading(null);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="max-w-md w-full animate-in fade-in-50 slide-in-from-bottom-4 duration-700 relative z-10">
        {/* Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to VizzarJobs
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 pt-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 mb-1">
              Welcome Back
            </CardTitle>
            <p className="text-slate-600">
              Sign in to your VizzarJobs account
            </p>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            {/* Auth Mode Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setAuthMode("oauth")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  authMode === "oauth"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Social Login
              </button>
              <button
                onClick={() => setAuthMode("password")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  authMode === "password"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Email & Password
              </button>
            </div>

            {/* Role Selection */}
            <div className="space-y-3" data-role-selection>
              <h4 className="text-center text-slate-700 font-medium">I am a...</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedRole("JOB_SEEKER")}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    selectedRole === "JOB_SEEKER"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">Job Seeker</span>
                </button>
                <button
                  onClick={() => setSelectedRole("EMPLOYER")}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    selectedRole === "EMPLOYER"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium text-sm">Employer</span>
                </button>
              </div>
              {!selectedRole && (
                <p className="text-xs text-amber-600 text-center">
                  ⚠️ Please select your role to continue
                </p>
              )}
            </div>

            {/* Password Authentication Form */}
            {authMode === "password" && (
              <form onSubmit={handlePasswordSignIn} className="space-y-3">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading === "credentials" || !selectedRole}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  {isLoading === "credentials" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot your password?
                  </Link>
                </div>
              </form>
            )}

            {/* Sign In Providers */}
            {authMode === "oauth" && (
              <div className="space-y-3">
                <h4 className="text-center text-slate-700 font-medium mb-3">Sign in with your preferred account</h4>
                {providers && Object.values(providers)
                  .filter(provider => provider.id !== "credentials")
                  .map((provider) => {
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
            )}

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-slate-600 text-sm">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Terms */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                By signing in, you agree to our{" "}
                <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
