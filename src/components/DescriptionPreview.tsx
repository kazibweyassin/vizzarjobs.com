import React from 'react';

interface DescriptionPreviewProps {
  content: string;
  maxLines?: number;
  className?: string;
}

export function DescriptionPreview({ content, maxLines = 2, className = '' }: DescriptionPreviewProps) {
  if (!content) {
    return <p className={`text-slate-400 italic ${className}`}>No description available</p>;
  }
  
  // Strip HTML tags for preview
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Truncate to approximate character limit for 2 lines
  const maxChars = maxLines * 80; // Approximate chars per line
  const truncated = plainText.length > maxChars 
    ? plainText.substring(0, maxChars) + '...'
    : plainText;
  
  return (
    <p className={`line-clamp-${maxLines} leading-relaxed ${className}`}>
      {truncated}
    </p>
  );
}
