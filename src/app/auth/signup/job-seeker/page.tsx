"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, getProviders } from "next-auth/react";
import {
  ArrowLeft,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Chrome,
  Github,
  Plane,
} from "lucide-react";
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

const providerIcons: Record<string, typeof Chrome> = {
  google: Chrome,
  github: Github,
};

export default function JobSeekerSignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    getProviders().then(setProviders).catch(console.error);
  }, []);

  const handleOAuthSignUp = async (providerId: string) => {
    setIsLoading(providerId);
    try {
      await signIn(providerId, { callbackUrl: "/jobs", role: "JOB_SEEKER" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(null);
    }
  };

  const createUserMutation = api.users.createWithPassword.useMutation({
    onSuccess: async () => {
      // Auto sign-in immediately after account creation
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.ok) {
        window.location.href = "/jobs";
      } else {
        // Account created but auto-login failed â€” send to sign-in
        window.location.href = "/auth/signin";
      }
    },
    onError: (err) => {
      setError(err.message || "An error occurred. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    await createUserMutation.mutateAsync({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "JOB_SEEKER",
    });
  };

  const oauthProviders = providers
    ? Object.values(providers).filter((p) => p.id !== "credentials" && providerIcons[p.id])
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-4">
            <Plane className="w-3.5 h-3.5" />
            Job Seeker Account
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Find visa-sponsored jobs abroad</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
          {/* OAuth */}
          {oauthProviders.length > 0 && (
            <div className="space-y-3">
              {oauthProviders.map((provider) => {
                const Icon = providerIcons[provider.id]!;
                return (
                  <button
                    key={provider.id}
                    onClick={() => handleOAuthSignUp(provider.id)}
                    disabled={!!isLoading}
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all disabled:opacity-60"
                  >
                    {isLoading === provider.id ? (
                      <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4 text-gray-500" />
                    )}
                    Continue with {provider.name}
                  </button>
                );
              })}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400">or sign up with email</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            )}

            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
              <div className="mt-1.5 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="name" type="text" placeholder="Your full name" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 border-gray-200 focus:border-[#0F2C4C] focus:ring-[#0F2C4C]" required />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="email" type="email" placeholder="you@example.com" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 border-gray-200 focus:border-[#0F2C4C] focus:ring-[#0F2C4C]" required />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 border-gray-200 focus:border-[#0F2C4C] focus:ring-[#0F2C4C]" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Repeat password"
                  value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10 border-gray-200 focus:border-[#0F2C4C] focus:ring-[#0F2C4C]" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={createUserMutation.isPending}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0F2C4C] hover:bg-[#1a3d63] text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {createUserMutation.isPending ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</>
              ) : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold text-[#0F2C4C] hover:text-amber-600 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}


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

