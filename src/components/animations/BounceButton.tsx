"use client";

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface BounceButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function BounceButton({
  children,
  className = '',
  onClick
}: BounceButtonProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
