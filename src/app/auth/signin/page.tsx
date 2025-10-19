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
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Brain,
  CheckCircle
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
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI/ML Talent • Canada Focus
            </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to access your AI/ML opportunities in Canada
          </p>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole("JOB_SEEKER")}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedRole === "JOB_SEEKER"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Users className={`w-6 h-6 ${selectedRole === "JOB_SEEKER" ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`font-medium ${selectedRole === "JOB_SEEKER" ? "text-blue-600" : "text-gray-600"}`}>
                  Job Seeker
                </span>
              </div>
            </button>
            <button
              onClick={() => setSelectedRole("EMPLOYER")}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedRole === "EMPLOYER"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Building2 className={`w-6 h-6 ${selectedRole === "EMPLOYER" ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`font-medium ${selectedRole === "EMPLOYER" ? "text-blue-600" : "text-gray-600"}`}>
                  Employer
                </span>
              </div>
            </button>
          </div>
        </motion.div>

            {/* Auth Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setAuthMode("oauth")}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                  authMode === "oauth"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
                }`}
              >
              Quick Sign In
              </button>
              <button
                onClick={() => setAuthMode("password")}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                  authMode === "password"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
                }`}
              >
                Email & Password
              </button>
            </div>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              {authMode === "oauth" ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                    Choose your sign-in method
                  </h3>
                  {providers && Object.values(providers).map((provider) => {
                    const Icon = providerIcons[provider.id as keyof typeof providerIcons];
                    return (
                      <Button
                        key={provider.name}
                        onClick={() => handleOAuthSignIn(provider.id)}
                        disabled={isLoading === provider.id || !selectedRole}
                        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-200"
                      >
                        {isLoading === provider.id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Icon className="w-5 h-5 mr-3" />
                            Continue with {provider.name}
                          </>
                        )}
                      </Button>
                    );
                  })}
            </div>
              ) : (
                <form onSubmit={handleCredentialsSignIn} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                      placeholder="Enter your email"
                      className="mt-2 h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        placeholder="Enter your password"
                        className="h-12 rounded-xl pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading === "credentials" || !selectedRole}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  {isLoading === "credentials" ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            )}

              {!selectedRole && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Please select your role above to continue
                  </div>
              </div>
            )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
                </Link>
              </p>
          <Link href="/auth/forgot-password" className="text-gray-500 hover:text-gray-700 text-sm mt-2 inline-block">
            Forgot your password?
                </Link>
        </motion.div>
      </div>
    </div>
  );
}