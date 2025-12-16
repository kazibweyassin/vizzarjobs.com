"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, getProviders } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Chrome,
  Github,
  MessageCircle
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
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

export default function EmployerSignUpPage() {
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
    setIsLoading(providerId);
    try {
      await signIn(providerId, { 
        callbackUrl: "/",
        role: "EMPLOYER" 
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
        role: "EMPLOYER"
      });
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  if (success) {
    return (
      <div className="flex min-h-full flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              Account Created!
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Your employer account is pending verification. You'll be able to post jobs once approved.
            </p>
            <Link href="/auth/signin">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white">
                Sign in to your account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Back Link */}
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Sign up as Employer
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Create your account to start hiring talent
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="mb-6 flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setAuthMode("oauth")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              authMode === "oauth"
                ? "bg-emerald-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Quick Sign Up
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("password")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              authMode === "password"
                ? "bg-emerald-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Email & Password
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

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
                    onClick={() => handleOAuthSignUp(provider.id)}
                    disabled={isLoading === provider.id}
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-100">
                Company/Your Name
              </Label>
              <div className="mt-2 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter company or your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-100">
                Email address
              </Label>
              <div className="mt-2 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-100">
                Password
              </Label>
              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  minLength={8}
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

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-100">
                Confirm Password
              </Label>
              <div className="mt-2 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex w-full justify-center bg-emerald-500 hover:bg-emerald-400 text-white"
              >
                {createUserMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>
          </form>
        )}

        <p className="mt-10 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
