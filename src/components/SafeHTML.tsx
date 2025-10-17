import React from 'react';

interface SafeHTMLProps {
  content: string;
  className?: string;
}

export function SafeHTML({ content, className = '' }: SafeHTMLProps) {
  // Server-safe HTML entity decoding
  const decodeHTMLEntities = (text: string): string => {
    return text
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
      // Additional UTF-8 encoding fixes
      .replace(/â€¨/g, '\n')  // Line break
      .replace(/â€©/g, '\n')  // Line break
      .replace(/â€¬/g, '')    // Zero-width non-breaking space
      .replace(/â€­/g, '')    // Soft hyphen
      .replace(/â€®/g, '')    // Zero-width joiner
      .replace(/â€¯/g, '')    // Zero-width non-joiner
      // Fix more encoding issues
      .replace(/â€¨/g, '\n')
      .replace(/â€©/g, '\n')
      .replace(/â€¬/g, '')
      .replace(/â€­/g, '')
      .replace(/â€®/g, '')
      .replace(/â€¯/g, '');
  };

  // Clean up HTML formatting issues
  const cleanHTML = (text: string): string => {
    let cleaned = text;
    
    // Remove standalone numbers at the beginning of lines
    cleaned = cleaned.replace(/^\d+\s*$/gm, '');
    cleaned = cleaned.replace(/^\d+\s*<p>/gm, '<p>');
    
    // Remove numbered prefixes from HTML tags
    cleaned = cleaned.replace(/^\d+\s*<p[^>]*>/gm, '<p>');
    cleaned = cleaned.replace(/^\d+\s*<b[^>]*>/gm, '<b>');
    cleaned = cleaned.replace(/^\d+\s*<u[^>]*>/gm, '<u>');
    cleaned = cleaned.replace(/^\d+\s*<i[^>]*>/gm, '<i>');
    cleaned = cleaned.replace(/^\d+\s*<strong[^>]*>/gm, '<strong>');
    cleaned = cleaned.replace(/^\d+\s*<h[1-6][^>]*>/gm, (match) => match.replace(/^\d+\s*/, ''));
    
    // Remove empty paragraphs
    cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');
    cleaned = cleaned.replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, '');
    
    // Clean up nested tags
    cleaned = cleaned.replace(/<p[^>]*>\s*<p[^>]*>/gi, '<p>');
    cleaned = cleaned.replace(/<\/p>\s*<\/p>/gi, '</p>');
    
    // Remove div tags but keep content
    cleaned = cleaned.replace(/<div[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/div>/gi, '');
    
    // Convert br tags to line breaks
    cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
    
    // Clean up excessive whitespace
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Remove any remaining standalone numbers
    cleaned = cleaned.replace(/^\d+\s*$/gm, '');
    
    return cleaned.trim();
  };
  
  // Only render if content contains HTML tags
  const hasHTML = /<[^>]*>/g.test(content);
  
  if (!hasHTML) {
    // If no HTML, render as plain text with line breaks
    return (
      <div className={className}>
        {content.split('\n').map((line, index) => (
          <p key={index} className="mb-2 last:mb-0">
            {line}
          </p>
        ))}
      </div>
    );
  }
  
  // If HTML content, decode entities and render safely
  const decodedContent = decodeHTMLEntities(content);
  const cleanedContent = cleanHTML(decodedContent);
  
  return (
    <div 
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanedContent }}
    />
  );
}
