"use client";

import { useState } from "react";
import { LeadCaptureModal } from "~/components/modals/LeadCaptureModal";
import { useLeadCapture } from "~/hooks/useLeadCapture";
import { ProfileCreationButton } from "~/components/ProfileCreationButton";
import { FixedProfileButton } from "~/components/FixedProfileButton";

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
      
      {/* Profile Creation Button - Fixed in the lower right corner */}
      <div className="fixed bottom-8 right-8 z-40">
        <FixedProfileButton />
      </div>
      
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
