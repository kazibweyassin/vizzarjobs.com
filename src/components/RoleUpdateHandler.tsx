"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

export function RoleUpdateHandler() {
  const { data: session, status } = useSession();
  const updateUserMutation = api.users.updateRole.useMutation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user && !hasProcessed.current) {
      const selectedRole = localStorage.getItem("selectedRole");
      
      // Don't update role if user is already ADMIN
      if (session.user.role === "ADMIN") {
        // Clear any stored role to prevent conflicts
        localStorage.removeItem("selectedRole");
        hasProcessed.current = true;
        return;
      }
      
      if (selectedRole && selectedRole !== session.user.role) {
        hasProcessed.current = true;
        // Update the user's role
        updateUserMutation.mutate(
          { role: selectedRole as "JOB_SEEKER" | "EMPLOYER" | "ADMIN" },
          {
            onSuccess: () => {
              // Clear the stored role and reload to update the session
              localStorage.removeItem("selectedRole");
              window.location.reload();
            },
            onError: () => {
              localStorage.removeItem("selectedRole");
              hasProcessed.current = false;
            },
          }
        );
      } else if (selectedRole) {
        // Role already matches, just clear the stored value
        localStorage.removeItem("selectedRole");
        hasProcessed.current = true;
      }
    }
  }, [session, status, updateUserMutation]);

  return null; // This component doesn't render anything
}
