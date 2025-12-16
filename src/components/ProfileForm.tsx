"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  User, 
  Building2, 
  Mail,
  Calendar,
  Save,
  Loader2
} from "lucide-react";

type UserRole = "JOB_SEEKER" | "EMPLOYER";

interface ProfileFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    profileComplete: boolean;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { update } = useSession();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateUserMutation = api.users.updateRole.useMutation({
    onSuccess: async (updatedUser: any) => {
      await update({
        user: {
          ...user,
          role: updatedUser.role,
          profileComplete: updatedUser.profileComplete,
        },
      });
      setIsUpdating(false);
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error);
      setIsUpdating(false);
    },
  });

  const handleSave = async () => {
    if (selectedRole === user.role) return;

    setIsUpdating(true);
    updateUserMutation.mutate({
      role: selectedRole,
      profileComplete: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {user.image && (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name || "No name provided"}
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Account Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Job Seeker Option */}
            <button
              onClick={() => setSelectedRole("JOB_SEEKER")}
              className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                selectedRole === "JOB_SEEKER"
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Job Seeker</h3>
                  <p className="text-sm text-gray-600">
                    Looking for visa-sponsored tech jobs
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
                {selectedRole === "JOB_SEEKER" && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>

            {/* Employer Option */}
            <button
              onClick={() => setSelectedRole("EMPLOYER")}
              className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                selectedRole === "EMPLOYER"
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Employer</h3>
                  <p className="text-sm text-gray-600">
                    Post jobs and hire talent
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      Post Jobs
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                      Hire
                    </Badge>
                  </div>
                </div>
                {selectedRole === "EMPLOYER" && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Save Button */}
          {selectedRole !== user.role && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${
                user.profileComplete 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {user.profileComplete ? "Profile Complete" : "Profile Incomplete"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
