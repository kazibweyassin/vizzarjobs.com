# Font Size Standardization Guide

## Current Typography Scale

The platform now uses a consistent typography system defined in `src/lib/typography.ts`.

### Heading Sizes
- **H1**: `text-4xl md:text-5xl` (36px → 48px) - Hero titles, main landing page headers
- **H2**: `text-3xl md:text-4xl` (30px → 36px) - Section titles, major page headers
- **H3**: `text-2xl` (24px) - Subsection titles, card group headers
- **H4**: `text-xl` (20px) - Card titles, smaller headings

### Body Text Sizes
- **Large**: `text-lg` (18px) - Lead paragraphs, featured descriptions
- **Base**: `text-base` (16px) - Standard paragraph text (DEFAULT)
- **Small**: `text-sm` (14px) - Secondary info, labels, meta data
- **Extra Small**: `text-xs` (12px) - Helper text, timestamps, fine print

### Component-Specific Sizes

#### Navigation & Menus
- Nav links: `text-sm font-medium` (14px)
- Menu items: `text-sm` (14px)
- User dropdown text: `text-sm` (14px)

#### Buttons & CTAs
- Primary large: `text-base font-semibold` (16px)
- Standard: `text-sm font-semibold` (14px)
- Small: `text-xs font-medium` (12px)

#### Badges & Tags
- All badges: `text-xs font-medium` (12px)
- Status indicators: `text-xs` (12px)

#### Forms
- Labels: `text-sm font-medium` (14px)
- Input text: `text-sm` (14px)
- Helper text: `text-xs` (12px)

#### Cards (Job Cards, Company Cards)
- Title: `text-lg font-bold` (18px)
- Company name: `text-sm` (14px)
- Location/Meta: `text-sm` (14px)
- Salary: `text-sm font-medium` (14px)

#### Statistics & Features
- Stat numbers: `text-3xl md:text-4xl font-bold` (30px → 36px)
- Featured text: `text-lg md:text-xl` (18px → 20px)

## Implementation Status

### ✅ Already Standardized
- `src/components/Navigation.tsx` - Navigation links, buttons, user dropdown
- `src/components/JobFilters.tsx` - Labels, buttons, filter options
- `src/components/ui/*` - All UI components (badge, button, input, etc.)
- `src/app/page.tsx` - Homepage hero, sections, CTAs

### 🔄 Needs Review
- Job listing pages - Ensure consistent card sizes
- Company profile pages - Header and content sizing
- User dashboard - Typography consistency
- Forms across the platform - Label and input sizing

### 📝 Recommendations

1. **Use the TYPOGRAPHY constant** from `src/lib/typography.ts` instead of inline Tailwind classes
2. **Avoid arbitrary sizes** - Stick to the defined scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl)
3. **Responsive sizing** - Use `md:` prefix for larger screens on h1, h2, and featured text
4. **Font weights**:
   - Headers: `font-bold` (700)
   - Subheaders: `font-semibold` (600)
   - Body: `font-normal` (400) or `font-medium` (500)
   - Labels: `font-medium` (500)

## Migration Path

To update existing components:

```tsx
// Before
<h1 className="text-5xl font-bold">Title</h1>

// After
import { TYPOGRAPHY } from "~/lib/typography";
<h1 className={TYPOGRAPHY.h1}>Title</h1>

// Or keep inline for now, but use standard sizes
<h1 className="text-4xl md:text-5xl font-bold">Title</h1>
```

## Quality Check

Run these checks to ensure consistency:

```powershell
# Find non-standard text sizes
grep -r "text-\[" src/

# Find headings without responsive sizing
grep -r "text-5xl" src/ | grep -v "md:"

# Find buttons with inconsistent sizing
grep -r "button.*text-" src/
```
