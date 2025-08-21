"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LeadCaptureModal } from "~/components/modals/LeadCaptureModal";
import { useLeadCapture } from "~/hooks/useLeadCapture";

export function LeadCaptureWrapper({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const { submitLead, isLoading } = useLeadCapture();
  const pathname = usePathname();
  
  const isHomePage = pathname === "/";
  const isWhyUsPage = pathname === "/why-us";
  
  useEffect(() => {
    // Only show modal on homepage or why-us page
    // And check if it was already shown
    if ((isHomePage || isWhyUsPage)) {
      const hasShownModal = localStorage.getItem("vizzarjobs_modal_shown");
      // Check if we haven't shown the modal in the past 3 days
      const showAgain = hasShownModal ? 
        (Date.now() - parseInt(hasShownModal)) > (3 * 24 * 60 * 60 * 1000) : 
        true;
        
      if (showAgain) {
        // Set a timeout to show the modal after delay
        const timer = setTimeout(() => {
          setShowModal(true);
          // Store current timestamp when we show the modal
          localStorage.setItem("vizzarjobs_modal_shown", Date.now().toString());
        }, (isHomePage ? 20 : 15) * 1000); // 20 seconds on homepage, 15 on why-us page
        
        return () => clearTimeout(timer);
      }
    }
  }, [isHomePage, isWhyUsPage]);
  
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
          delayInSeconds={0}  // No additional delay since we're using setTimeout
          onClose={handleModalClose}
          onSubmit={handleLeadSubmit}
        />
      )}
    </>
  );
}
