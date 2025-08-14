"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  AlertCircle, 
  ArrowLeft, 
  RefreshCw,
  Shield,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
  OAuthSignin: "Error in constructing an authorization URL.",
  OAuthCallback: "Error in handling the response from an OAuth provider.",
  OAuthCreateAccount: "Could not create OAuth account.",
  EmailCreateAccount: "Could not create email account.",
  Callback: "Error in the OAuth callback handler route.",
  OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "The e-mail could not be sent.",
  CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof errorMessages;
  
  const errorMessage = errorMessages[error] || errorMessages.Default;
  const isOAuthError = error?.includes("OAuth");
  const isEmailError = error?.includes("Email");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to VizzarJobs
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Authentication Error
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {errorMessage}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error-specific help */}
            {isOAuthError && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  OAuth Authentication Issue
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  This usually happens when:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your account email is already linked to another provider</li>
                  <li>• The OAuth provider rejected the request</li>
                  <li>• Network connectivity issues</li>
                </ul>
              </div>
            )}

            {isEmailError && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Authentication Issue
                </h3>
                <p className="text-sm text-yellow-800">
                  Please check your email for a verification link, or try signing in with a different method.
                </p>
              </div>
            )}

            {error === "OAuthAccountNotLinked" && (
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Account Already Exists
                </h3>
                <p className="text-sm text-orange-800">
                  An account with this email already exists. Please sign in using the original method you used to create your account.
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Link>
              
              <Link
                href="/"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Continue Without Signing In
              </Link>
            </div>

            {/* Help section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Need Help?
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                If you continue to experience issues, try:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clearing your browser cookies</li>
                <li>• Using an incognito/private window</li>
                <li>• Trying a different authentication method</li>
                <li>• Contacting our support team</li>
              </ul>
            </div>

            {/* Debug info for development */}
            {process.env.NODE_ENV === "development" && error && (
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-xs text-gray-600 font-mono">
                  Error Code: {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
