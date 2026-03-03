"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Github,
  Chrome,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Plane,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><span className="w-6 h-6 border-2 border-[#0F2C4C] border-t-transparent rounded-full animate-spin" /></div>}>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  useEffect(() => {
    getProviders().then(setProviders).catch(console.error);
  }, []);

  const handleOAuthSignIn = async (providerId: string) => {
    setIsLoading(providerId);
    try {
      await signIn(providerId, { callbackUrl });
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(null);
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading("credentials");
    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const oauthProviders = providers
    ? Object.values(providers).filter(
        (p) => p.id !== "credentials" && providerIcons[p.id]
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-4">
            <Plane className="w-3.5 h-3.5" />
            VizzarJobs
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Job seekers and employers — sign in below.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
          {/* OAuth */}
          {oauthProviders.length > 0 && (
            <div className="space-y-3">
              {oauthProviders.map((provider) => {
                const Icon = providerIcons[provider.id]!;
                return (
                  <button
                    key={provider.id}
                    onClick={() => handleOAuthSignIn(provider.id)}
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
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400">or sign in with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Credentials form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  placeholder="you@example.com"
                  className="pl-10 border-gray-200 focus:border-[#0F2C4C] focus:ring-[#0F2C4C]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-[#0F2C4C] hover:text-amber-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 border-gray-200 focus:border-[#0F2C4C] focus:ring-[#0F2C4C]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!!isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0F2C4C] hover:bg-[#1a3d63] text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading === "credentials" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#0F2C4C] hover:text-amber-600 transition-colors">
              Sign up free
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Want to post jobs?{" "}
            <Link href="/auth/signup/employer" className="font-semibold text-[#0F2C4C] hover:text-amber-600 transition-colors">
              Create an employer account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

