"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  User, 
  Building2, 
  CheckCircle,
  Loader2,
  Briefcase,
  Users
} from "lucide-react";

type UserRole = "JOB_SEEKER" | "EMPLOYER";

export function RoleSelector() {
  const { data: session, update } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateUserMutation = api.users.updateRole.useMutation({
    onSuccess: async (updatedUser: any) => {
      console.log("✅ Role update successful:", updatedUser);
      // Update the session
      try {
        await update({
          ...session,
          user: {
            ...session?.user,
            role: updatedUser.role,
            profileComplete: updatedUser.profileComplete,
          },
        });
        console.log("✅ Session updated successfully");
        setIsUpdating(false);
      } catch (sessionError) {
        console.error("❌ Session update failed:", sessionError);
        setIsUpdating(false);
      }
    },
    onError: (error: any) => {
      console.error("❌ Failed to update role:", error);
      alert(`Error updating profile: ${error.message}`);
      setIsUpdating(false);
    },
  });

  const handleRoleChange = async (newRole: UserRole) => {
    if (!session?.user?.id) {
      console.error("❌ No user ID found in session");
      alert("Error: No user ID found. Please try signing in again.");
      return;
    }
    
    // Allow role setting even if it's the same role, as long as profile is not complete
    if (session.user.role === newRole && session.user.profileComplete) {
      return;
    }

    setIsUpdating(true);
    
    try {
      updateUserMutation.mutate({
        userId: session.user.id,
        role: newRole,
        profileComplete: true,
      });
    } catch (error) {
      console.error("❌ Mutation call failed:", error);
      setIsUpdating(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  // Show role selector if profile is not complete OR role is not set
  if (session.user.profileComplete && session.user.role) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
         id="role-selector-modal"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to VizzarJobs!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Let's set up your profile. How would you like to use VizzarJobs?
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Job Seeker Option */}
            <button
              onClick={() => handleRoleChange("JOB_SEEKER")}
              disabled={isUpdating}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Job Seeker</h3>
                  <p className="text-sm text-gray-600">
                    I'm looking for visa-sponsored tech jobs
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      Find Jobs
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      Apply
                    </Badge>
                  </div>
                </div>
                {session.user.role === "JOB_SEEKER" && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </button>

            {/* Employer Option */}
            <button
              onClick={() => handleRoleChange("EMPLOYER")}
              disabled={isUpdating}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Employer</h3>
                  <p className="text-sm text-gray-600">
                    I want to post jobs and hire talent
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                      Post Jobs
                    </Badge>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                      Hire
                    </Badge>
                  </div>
                </div>
                {session.user.role === "EMPLOYER" && (
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                )}
              </div>
            </button>
          </div>

          {isUpdating && (
            <div className="flex items-center justify-center gap-2 text-gray-600 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Setting up your profile...</span>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3 mt-6">
            <div className="flex items-center gap-2 text-gray-700 text-sm mb-3">
              <Users className="w-4 h-4" />
              <span>You can change this later in your profile settings</span>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
