"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Github, 
  Chrome, 
  MessageCircle, 
  ArrowLeft,
  Users,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

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

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"JOB_SEEKER" | "EMPLOYER" | null>(null);
  const [authMode, setAuthMode] = useState<"oauth" | "password">("oauth");
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleOAuthSignIn = async (providerId: string) => {
    if (!selectedRole) return;
    setIsLoading(providerId);
    try {
      await signIn(providerId, { 
        callbackUrl: "/",
        role: selectedRole 
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLoading("credentials");
    try {
      await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        role: selectedRole,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium mb-6 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
            <span>Welcome back</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Access your VizzarJobs account
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-100 mb-3">
            I am a...
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole("JOB_SEEKER")}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === "JOB_SEEKER"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Users className={`w-5 h-5 ${selectedRole === "JOB_SEEKER" ? "text-indigo-400" : "text-gray-400"}`} />
                <span className={`text-sm font-medium ${selectedRole === "JOB_SEEKER" ? "text-indigo-400" : "text-gray-400"}`}>
                  Job Seeker
                </span>
              </div>
            </button>
            <button
              onClick={() => setSelectedRole("EMPLOYER")}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === "EMPLOYER"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Building2 className={`w-5 h-5 ${selectedRole === "EMPLOYER" ? "text-emerald-400" : "text-gray-400"}`} />
                <span className={`text-sm font-medium ${selectedRole === "EMPLOYER" ? "text-emerald-400" : "text-gray-400"}`}>
                  Employer
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="mb-6 flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
          <button
            onClick={() => setAuthMode("oauth")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              authMode === "oauth"
                ? "bg-indigo-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Quick Sign In
          </button>
          <button
            onClick={() => setAuthMode("password")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              authMode === "password"
                ? "bg-indigo-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Email & Password
          </button>
        </div>

        {/* Auth Form */}
        {authMode === "oauth" ? (
          <div className="space-y-4">
            {providers && Object.values(providers)
              .filter(provider => provider.id !== "credentials" && providerIcons[provider.id as keyof typeof providerIcons])
              .map((provider) => {
                const Icon = providerIcons[provider.id as keyof typeof providerIcons]!;
                return (
                  <Button
                    key={provider.name}
                    type="button"
                    onClick={() => handleOAuthSignIn(provider.id)}
                    disabled={isLoading === provider.id || !selectedRole}
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-50"
                  >
                    {isLoading === provider.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Icon className="w-5 h-5 mr-2" />
                        Continue with {provider.name}
                      </>
                    )}
                  </Button>
                );
              })}
            
            <div className="relative my-6">
              <Separator className="bg-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 bg-gray-900 text-gray-400 text-sm">Or</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={() => setAuthMode("password")}
              variant="outline"
              className="w-full border-white/10 text-gray-300 hover:bg-white/5"
            >
              Use Email & Password Instead
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCredentialsSignIn} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-100">
                Email address
              </Label>
              <div className="mt-2 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  placeholder="you@example.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium text-gray-100">
                  Password
                </Label>
                <Link href="/auth/forgot-password" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!selectedRole && (
              <div className="p-3 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-center gap-2 text-indigo-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Please select your role above to continue
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading === "credentials" || !selectedRole}
                className="flex w-full justify-center bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-50"
              >
                {isLoading === "credentials" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <Link href="/auth/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
