import { type Metadata } from "next";
import { db } from "~/server/db";
import { HomePageSections } from "~/components/HomePageSections";
import { RoleUpdateHandler } from "~/components/RoleUpdateHandler";

export const metadata: Metadata = {
  title: "VizzarJobs | Visa-Sponsored Jobs for East African Professionals",
  description:
    "Find verified visa-sponsored jobs in UAE, UK, Canada, Germany & the Netherlands — plus local roles in Uganda, Kenya & Rwanda. Free for job seekers.",
};

// Revalidate every 10 minutes — keeps the page SSR-fresh without hitting DB on every request
export const revalidate = 600;

export default async function HomePage() {
  const [featuredJobs, jobCount] = await Promise.all([
    db.job
      .findMany({
        take: 6,
        where: { featured: true },
        orderBy: [{ visaSponsorship: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          location: true,
          country: true,
          visaSponsorship: true,
          remote: true,
          featured: true,
          salaryMin: true,
          salaryMax: true,
          company: { select: { name: true } },
        },
      })
      .then(async (jobs) => {
        // Backfill with non-featured jobs if fewer than 6 featured exist
        if (jobs.length < 6) {
          const ids = jobs.map((j) => j.id);
          const extras = await db.job.findMany({
            take: 6 - jobs.length,
            where: { id: { notIn: ids } },
            orderBy: [{ visaSponsorship: "desc" }, { createdAt: "desc" }],
            select: {
              id: true,
              title: true,
              location: true,
              country: true,
              visaSponsorship: true,
              remote: true,
              featured: true,
              salaryMin: true,
              salaryMax: true,
              company: { select: { name: true } },
            },
          });
          return [...jobs, ...extras];
        }
        return jobs;
      }),
    db.job.count(),
  ]);

  return (
    <>
      {/* Tiny client island — handles post-login role sync */}
      <RoleUpdateHandler />
      <HomePageSections featuredJobs={featuredJobs} jobCount={jobCount} />
    </>
  );
}
