"use client";

import { useState } from "react";
import { LeadCaptureModal } from "~/components/modals/LeadCaptureModal";
import { useLeadCapture } from "~/hooks/useLeadCapture";

export default function HomePageClient({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(true);
  const { submitLead, isLoading, success } = useLeadCapture();
  
  const handleModalClose = () => {
    setShowModal(false);
  };
  
  const handleLeadSubmit = async (data: { name: string; email: string; interests: string[] }) => {
    await submitLead(data);
    setShowModal(false);
  };
  
  return (
    <>
      {children}
      
      {showModal && (
        <LeadCaptureModal
          delayInSeconds={20}  // 20 seconds delay
          onClose={handleModalClose}
          onSubmit={handleLeadSubmit}
        />
      )}
    </>
  );
}
