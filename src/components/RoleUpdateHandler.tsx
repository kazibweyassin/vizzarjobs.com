"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

export function RoleUpdateHandler() {
  const { data: session, status } = useSession();
  const updateUserMutation = api.users.updateRole.useMutation();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const selectedRole = localStorage.getItem("selectedRole");
      
      if (selectedRole && selectedRole !== session.user.role) {
        // Update the user's role
        updateUserMutation.mutate(
          { role: selectedRole as "JOB_SEEKER" | "EMPLOYER" },
          {
            onSuccess: () => {
              // Clear the stored role and reload to update the session
              localStorage.removeItem("selectedRole");
              window.location.reload();
            },
            onError: () => {
              localStorage.removeItem("selectedRole");
            },
          }
        );
      } else if (selectedRole) {
        // Role already matches, just clear the stored value
        localStorage.removeItem("selectedRole");
      }
    }
  }, [session, status, updateUserMutation]);

  return null; // This component doesn't render anything
}
