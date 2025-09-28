"use client";

import { RoleUpdateHandler } from "./RoleUpdateHandler";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoleUpdateHandler />
      {children}
    </>
  );
}
