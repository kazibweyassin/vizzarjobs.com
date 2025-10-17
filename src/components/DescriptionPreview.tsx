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
  
  // Strip HTML tags and fix encoding issues for preview
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&euro;/g, '€')
    .replace(/&pound;/g, '£')
    .replace(/&yen;/g, '¥')
    .replace(/&cent;/g, '¢')
    .replace(/&middot;/g, '·')
    .replace(/&bull;/g, '•')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    // Fix common encoding issues
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€˜/g, "'")
    .replace(/â€/g, "'")
    .replace(/â€"/g, '"')
    .replace(/â€"/g, '"')
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
    .replace(/â€"/g, '-')
    .replace(/â€¦/g, '...')
    .replace(/â€¢/g, '•')
    .replace(/â€"/g, '°')
    .replace(/â€"/g, '®')
    .replace(/â€"/g, '©')
    .replace(/â€"/g, '™')
    .replace(/â‚¬/g, '€')
    .replace(/Â£/g, '£')
    .replace(/Â¥/g, '¥')
    .replace(/Â /g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2013/g, '–')
    .replace(/\u2014/g, '—')
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u2022/g, '•')
    .replace(/\u00B0/g, '°')
    .replace(/\u00AE/g, '®')
    .replace(/\u00A9/g, '©')
    .replace(/\u2122/g, '™')
    .replace(/\u20AC/g, '€')
    .replace(/\u00A3/g, '£')
    .replace(/\u00A5/g, '¥')
    // Additional encoding issues
    .replace(/â€¨/g, '\n')  // Line break character
    .replace(/â€©/g, '\n')  // Another line break variant
    .replace(/â€¬/g, '')    // Zero-width non-breaking space
    .replace(/â€­/g, '')    // Soft hyphen
    .replace(/â€®/g, '')    // Zero-width joiner
    .replace(/â€¯/g, '')    // Zero-width non-joiner
    // Fix literal \n showing as text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
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
