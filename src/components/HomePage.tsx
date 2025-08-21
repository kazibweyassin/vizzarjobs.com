"use client";

import { useState } from "react";
import Link from "next/link";
import { LeadCaptureModal } from "~/components/modals/LeadCaptureModal";
import { useLeadCapture } from "~/hooks/useLeadCapture";

export function HomePage({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(true);
  const { submitLead, isLoading, success } = useLeadCapture();
  
  const handleModalClose = () => {
    setShowModal(false);
  };
  
  const handleLeadSubmit = async (data: { name: string; email: string; interests: string[] }) => {
    await submitLead(data);
  };
  
  return (
    <>
      {children}
      
      {showModal && (
        <LeadCaptureModal
          delayInSeconds={15}
          onClose={handleModalClose}
          onSubmit={handleLeadSubmit}
        />
      )}
    </>
  );
}
