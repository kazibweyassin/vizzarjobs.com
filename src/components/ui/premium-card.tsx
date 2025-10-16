"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  premium?: boolean;
  hover?: boolean;
}

const PremiumCard: React.FC<CardProps> = ({ 
  children, 
  className,
  premium = false,
  hover = true,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        'rounded-xl overflow-hidden',
        premium ? 
          'border border-slate-200/80 bg-white shadow-lg shadow-blue-900/5' : 
          'border border-slate-200 bg-white shadow-sm',
        className
      )}
      {...props}
    >
      {premium && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      )}
      {children}
    </motion.div>
  );
};

export { PremiumCard };
