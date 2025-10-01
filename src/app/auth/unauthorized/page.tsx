import Link from "next/link";
import { ArrowLeft, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
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
            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Access Denied
            </CardTitle>
            <p className="text-slate-600 text-lg">
              You don't have permission to access this page
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Unauthorized Access</span>
              </div>
              <p className="text-red-600 text-sm">
                This page requires special permissions that your account doesn't have.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                If you believe this is an error, please contact support or try signing in with a different account.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link href="/auth/signin">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                    Sign In with Different Account
                  </Button>
                </Link>
                
                <Link href="/contact">
                  <Button variant="outline" className="w-full py-3">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Make sure you're signed in with the correct account</p>
                <p>• Check if your account has the required permissions</p>
                <p>• Contact your administrator if you need access</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}