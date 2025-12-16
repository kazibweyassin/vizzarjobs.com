# REBRAND IMPLEMENTATION PLAN

## Phase 1: Core Branding ✅ DONE
- [x] Update site metadata
- [x] Update hero section messaging
- [x] Update CTAs

## Phase 2: Add Job Categories Section
Add after hero, before featured jobs:

```tsx
{/* Job Categories Section */}
<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Browse Jobs by Category
      </h2>
      <p className="text-lg text-gray-600">
        Find opportunities across multiple industries
      </p>
    </div>

    <div className="grid md:grid-cols-4 gap-6">
      {/* Technology & IT */}
      <Link href="/jobs?category=technology">
        <Card hover with icon>
          💻 Technology & IT
          500+ jobs
        </Card>
      </Link>

      {/* Sales & Business Development */}
      <Link href="/jobs?category=sales">
        <Card>
          📈 Sales & Business
          300+ jobs
        </Card>
      </Link>

      {/* Marketing & Communications */}
      <Link href="/jobs?category=marketing">
        <Card>
          📱 Marketing & Communications
          250+ jobs
        </Card>
      </Link>

      {/* Finance & Accounting */}
      <Link href="/jobs?category=finance">
        <Card>
          💰 Finance & Accounting
          200+ jobs
        </Card>
      </Link>

      {/* Customer Success */}
      <Link href="/jobs?category=customer-success">
        <Card>
          🎯 Customer Success
          150+ jobs
        </Card>
      </Link>

      {/* Product & Project Management */}
      <Link href="/jobs?category=product">
        <Card>
          🚀 Product & Project
          120+ jobs
        </Card>
      </Link>

      {/* Design & Creative */}
      <Link href="/jobs?category=design">
        <Card>
          🎨 Design & Creative
          100+ jobs
        </Card>
      </Link>

      {/* Operations & Admin */}
      <Link href="/jobs?category=operations">
        <Card>
          ⚙️ Operations & Admin
          80+ jobs
        </Card>
      </Link>
    </div>
  </div>
</section>
```

## Phase 3: Update Featured Jobs Section
Change from "Featured Tech Jobs in Canada" to "Latest Professional Opportunities"

## Phase 4: Add Location Section
```tsx
{/* Browse by Location */}
<section>
  <h2>Find Jobs by Location</h2>
  
  - 🇺🇬 Uganda (Kampala, Entebbe, Gulu)
  - 🇰🇪 Kenya (Nairobi, Mombasa, Kisumu)
  - 🇷🇼 Rwanda (Kigali)
  - 🇹🇿 Tanzania (Dar es Salaam, Arusha)
  - 🌍 Remote/International
</section>
```

## Phase 5: Update Stats Section
```tsx
Current: "Tech opportunities" stats
New: 
  - 10,000+ Professional Jobs
  - 500+ Companies Hiring
  - Uganda, Kenya, Rwanda, Tanzania
  - 50+ Job Categories
```

## Phase 6: Update Navigation
Add categories dropdown

## Phase 7: Create Job Category Pages
- /jobs/technology
- /jobs/sales
- /jobs/marketing
- /jobs/finance
- etc.

## Phase 8: Database Schema Updates
Add `category` field to Job model if not exists

## Phase 9: Import Multi-Category Jobs
Remove fake VIZAID jobs, import real professional jobs

## Phase 10: Create Content Pages
- Salary Guide
- Company Directory  
- Career Resources
- Interview Tips
