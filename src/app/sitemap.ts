import { MetadataRoute } from 'next';
import { db } from '~/server/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get base URL from environment or default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || 'https://vizzarjobs.com';

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Job categories for East Africa
  const categories = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Sales & Marketing',
    'Engineering',
    'Hospitality',
    'Construction',
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/jobs?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // East African locations
  const locations = [
    'Uganda',
    'Kenya',
    'Rwanda',
    'Tanzania',
    'Kampala',
    'Nairobi',
    'Kigali',
    'Dar es Salaam',
    'Remote',
  ];

  const locationPages: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}/jobs?location=${encodeURIComponent(location)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  try {
    // Fetch all published jobs
    const jobs = await db.job.findMany({
      where: {
        // Only include active jobs (you might want to add filters here)
      },
      select: {
        id: true,
        updatedAt: true,
        createdAt: true,
      },
      // Limit to prevent sitemap from being too large
      // Google recommends keeping sitemaps under 50MB and 50,000 URLs
      take: 10000, // Adjust based on your needs
    });

    // Generate sitemap entries for jobs
    const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: job.updatedAt || job.createdAt,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Fetch all companies
    const companies = await db.company.findMany({
      where: {
        // Only include verified companies or all companies
        verified: true, // Adjust based on your needs
      },
      select: {
        id: true,
        updatedAt: true,
        createdAt: true,
      },
      take: 5000, // Adjust based on your needs
    });

    // Generate sitemap entries for companies
    const companyPages: MetadataRoute.Sitemap = companies.map((company) => ({
      url: `${baseUrl}/companies/${company.id}`,
      lastModified: company.updatedAt || company.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Combine all pages
    return [...staticPages, ...categoryPages, ...locationPages, ...jobPages, ...companyPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages even if database query fails
    return [...staticPages, ...categoryPages, ...locationPages];
  }
}

