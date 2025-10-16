"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LeadCaptureModalProps {
  delayInSeconds?: number;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; interests: string[] }) => void;
}

export function LeadCaptureModal({
  delayInSeconds = 10,
  onClose,
  onSubmit,
}: LeadCaptureModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interests: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Options for the interests checkboxes
  const interestOptions = [
    { id: "remote-jobs", label: "Remote Jobs" },
    { id: "visa-sponsored", label: "Visa Sponsorship" },
    { id: "tech-roles", label: "Tech Roles" },
    { id: "finance-roles", label: "Finance Roles" },
    { id: "healthcare-roles", label: "Healthcare Roles" },
  ];

  useEffect(() => {
    // Show modal after delay
    const timer = setTimeout(() => {
      // Check if modal has been shown before using localStorage
      const hasShownModal = localStorage.getItem("vizzarjobs_modal_shown");
      if (!hasShownModal) {
        setIsVisible(true);
        // Set flag in localStorage so we don't show it again too soon
        localStorage.setItem("vizzarjobs_modal_shown", Date.now().toString());
      }
    }, delayInSeconds * 1000);

    return () => clearTimeout(timer);
  }, [delayInSeconds]);

  const handleClose = () => {
    setIsVisible(false);
    // Short delay to allow animation to complete
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const updatedInterests = prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest];

      return {
        ...prev,
        interests: updatedInterests,
      };
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with close button */}
              <div className="flex justify-between items-center p-6 pb-0">
                <h2 className="text-2xl font-bold text-gray-900">Join Our Talent Network</h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Modal content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Get personalized job recommendations and visa sponsorship opportunities delivered to your inbox.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Name field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Email field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {/* Interests checkboxes */}
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-2">
                        What are you interested in?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {interestOptions.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <input
                              id={option.id}
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              checked={formData.interests.includes(option.id)}
                              onChange={() => handleInterestToggle(option.id)}
                            />
                            <label htmlFor={option.id} className="ml-2 text-sm text-gray-700">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                        isSubmitting
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      }`}
                    >
                      {isSubmitting ? "Submitting..." : "Get Personalized Opportunities"}
                    </button>
                  </div>
                </form>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By submitting, you agree to our Privacy Policy and Terms of Service.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
