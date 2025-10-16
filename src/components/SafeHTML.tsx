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
      .replace(/&rdquo;/g, '"');
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
  
  return (
    <div 
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: decodedContent }}
    />
  );
}
