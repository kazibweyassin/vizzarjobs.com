"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedHeroOverlayProps {
  className?: string;
}

export function AnimatedHeroOverlay({ className }: AnimatedHeroOverlayProps) {
  return (
    <motion.div
      className={className || "absolute inset-0 bg-black opacity-10"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 1 }}
    />
  );
}

interface AnimatedFeatureProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

export function AnimatedFeature({ children, index = 0, className }: AnimatedFeatureProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, index = 0 }: AnimatedFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1
      }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}
