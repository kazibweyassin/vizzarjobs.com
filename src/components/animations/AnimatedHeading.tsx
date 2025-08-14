"use client";

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface AnimatedHeadingProps {
  children: ReactNode;
  level?: HeadingLevel;
  className?: string;
  delay?: number;
  underline?: boolean;
  viewport?: boolean;
}

export default function AnimatedHeading({
  children,
  level = 'h2',
  className = '',
  delay = 0,
  underline = false,
  viewport = true
}: AnimatedHeadingProps) {
  const HeadingTag = motion[level] as any;
  
  const baseClassName = `font-bold ${className}`;

  const animation = {
    initial: { 
      opacity: 0, 
      y: 20 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        delay,
        ease: "easeOut"
      }
    }
  };
  
  const viewportOptions = viewport ? { 
    once: true, 
    margin: "-100px" 
  } : undefined;

  return (
    <div className="relative">
      <HeadingTag
        className={baseClassName}
        initial="initial"
        whileInView="animate"
        viewport={viewportOptions}
        variants={animation}
      >
        {children}
      </HeadingTag>
      
      {underline && (
        <motion.div
          className="h-1 bg-blue-500 rounded mt-2 w-16"
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 64, opacity: 1 }}
          viewport={viewportOptions}
          transition={{ 
            duration: 0.7, 
            delay: delay + 0.2,
            ease: "easeOut"
          }}
        />
      )}
    </div>
  );
}
