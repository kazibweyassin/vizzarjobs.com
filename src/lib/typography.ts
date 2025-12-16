/**
 * Typography Scale - Standardized Font Sizes
 * 
 * This file defines the consistent typography system for VizzarJobs platform.
 * Use these Tailwind classes across all components for uniform appearance.
 */

export const TYPOGRAPHY = {
  // Headings
  h1: 'text-4xl md:text-5xl font-bold', // Hero titles (homepage, landing pages)
  h2: 'text-3xl md:text-4xl font-bold', // Section titles
  h3: 'text-2xl font-bold', // Subsection titles
  h4: 'text-xl font-semibold', // Card titles, smaller headings
  
  // Body Text
  bodyLarge: 'text-lg', // Lead paragraphs, important descriptions
  bodyBase: 'text-base', // Standard body text, default paragraph size
  bodySmall: 'text-sm', // Secondary information, labels
  bodyXs: 'text-xs', // Helper text, timestamps, metadata
  
  // Navigation & Menu
  navLink: 'text-sm font-medium', // Navigation links
  menuItem: 'text-sm', // Dropdown menu items
  
  // Buttons & CTAs
  buttonLarge: 'text-base font-semibold', // Primary CTAs
  buttonBase: 'text-sm font-semibold', // Standard buttons
  buttonSmall: 'text-xs font-medium', // Small action buttons
  
  // Badges & Tags
  badge: 'text-xs font-medium', // Status badges, category tags
  
  // Form Elements
  label: 'text-sm font-medium', // Form field labels
  input: 'text-sm', // Input field text
  helperText: 'text-xs', // Form helper text, validation messages
  
  // Cards & Lists
  cardTitle: 'text-lg font-bold', // Job card titles, company names
  cardMeta: 'text-sm', // Card metadata (location, date, etc.)
  listItem: 'text-base', // List item text
  
  // Special
  statNumber: 'text-3xl md:text-4xl font-bold', // Statistics, metrics
  featuredText: 'text-lg md:text-xl', // Featured paragraphs
} as const;

/**
 * Usage Examples:
 * 
 * <h1 className={TYPOGRAPHY.h1}>Hero Title</h1>
 * <h2 className={TYPOGRAPHY.h2}>Section Title</h2>
 * <p className={TYPOGRAPHY.bodyBase}>Standard paragraph text</p>
 * <button className={`${TYPOGRAPHY.buttonLarge} bg-emerald-600`}>Primary CTA</button>
 * <span className={TYPOGRAPHY.badge}>New</span>
 */
