"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, getProviders } from "next-auth/react";
import { 
  ArrowLeft,
  Users,
  Building2,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Chrome,
  Github,
  MessageCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

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

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<"JOB_SEEKER" | "EMPLOYER" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"oauth" | "password">("oauth");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleOAuthSignUp = async (providerId: string) => {
    if (!selectedRole) {
      setError("Please select your role first");
      return;
    }
    setIsLoading(providerId);
    try {
      await signIn(providerId, { 
        callbackUrl: "/",
        role: selectedRole 
      });
    } catch (error) {
      console.error("Sign up error:", error);
      setError("An error occurred during sign up");
    } finally {
      setIsLoading(null);
    }
  };

  const createUserMutation = api.users.createWithPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setError("");
    },
    onError: (error) => {
      setError(error.message || "An error occurred during sign up");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!selectedRole) {
      setError("Please select your role");
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole
      });
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  if (success) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4 py-8 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2084&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="max-w-md w-full relative z-10">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
                Welcome to VizzarJobs!
              </CardTitle>
              <p className="text-slate-600 text-lg">
                Your account has been created successfully
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8 text-center">
              <p className="text-slate-600 mb-6">
                You can now sign in with your email and password to access your dashboard.
              </p>
              <Link href="/auth/signin">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  Sign In to Your Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
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

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Join VizzarJobs
            </CardTitle>
            <p className="text-slate-600 text-lg">
              Create your account and start your journey
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Role Selection - Always visible */}
            <div className="space-y-3 mb-6">
              <Label className="text-base font-medium">I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("JOB_SEEKER")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                    selectedRole === "JOB_SEEKER"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("EMPLOYER")}
                  className={`p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                    selectedRole === "EMPLOYER"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Employer</span>
                </button>
              </div>
            </div>

            {/* Auth Mode Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setAuthMode("oauth")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  authMode === "oauth"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Quick Sign Up
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("password")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  authMode === "password"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Email & Password
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
                {error}
              </div>
            )}

            {authMode === "oauth" ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 text-center mb-4">
                  Sign up quickly with your social account
                </p>
                {providers && Object.values(providers)
                  .filter(provider => provider.id !== "credentials" && providerIcons[provider.id as keyof typeof providerIcons])
                  .map((provider) => {
                    const Icon = providerIcons[provider.id as keyof typeof providerIcons]!;
                    return (
                      <Button
                        key={provider.name}
                        type="button"
                        onClick={() => handleOAuthSignUp(provider.id)}
                        disabled={isLoading === provider.id || !selectedRole}
                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all duration-200"
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
                {!selectedRole && (
                  <p className="text-xs text-amber-600 text-center mt-2">
                    Please select your role above to continue
                  </p>
                )}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Or</span>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => setAuthMode("password")}
                  variant="outline"
                  className="w-full"
                >
                  Use Email & Password Instead
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 8 characters)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    minLength={8}
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={createUserMutation.isPending || !selectedRole}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {createUserMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <div className="text-center pt-4">
                <p className="text-xs text-slate-500">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms-of-service" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </p>
              </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
