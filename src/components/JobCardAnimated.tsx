"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Award, CalendarRange, Building2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { formatSalary } from "~/lib/utils";
import { motion } from "framer-motion";

// Define simplified job props to avoid passing the whole Prisma schema
interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
      logo?: string | null;
      location?: string | null;
    };
    createdAt: Date;
    jobType?: string | null;
    experienceLevel?: string | null;
    salary?: number | null;
    salaryMax?: number | null;
    location?: string | null;
    visaSponsorship: boolean;
    locationType?: string | null;
  };
  index?: number;
}

export function JobCardAnimated({ job, index = 0 }: JobCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1, // Stagger effect
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      }}
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all border border-gray-100"
    >
      <Link href={`/jobs/${job.id}`} className="block p-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {job.company.logo ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                  <Image
                    src={job.company.logo}
                    alt={job.company.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center border border-gray-100">
                  <Building2 className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </div>
            <div>
              <motion.h3 
                className="font-bold text-lg text-gray-900 mb-1 hover:text-blue-600 transition-colors"
                whileHover={{ x: 3 }}
              >
                {job.title}
              </motion.h3>
              <p className="text-gray-600">{job.company.name}</p>
              {job.company.location && (
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location || job.company.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-right text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </span>
            </div>
            {job.visaSponsorship && (
              <Badge className="bg-gradient-to-r from-blue-600 to-green-600 flex items-center gap-1 hover:from-blue-700 hover:to-green-700">
                <Award className="w-3 h-3" />
                <span>Visa Sponsorship</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {job.jobType && (
              <Badge variant="outline" className="text-gray-700">
                {job.jobType}
              </Badge>
            )}
            {job.experienceLevel && (
              <Badge variant="outline" className="text-gray-700">
                {job.experienceLevel}
              </Badge>
            )}
            {job.locationType && (
              <Badge variant="outline" className="text-gray-700">
                {job.locationType}
              </Badge>
            )}
          </div>

          <div className="mt-3 flex justify-between items-center">
            {(job.salary || job.salaryMax) && (
              <div className="font-semibold text-gray-900">
                {formatSalary(job.salary, job.salaryMax)}
              </div>
            )}
            <motion.span 
              className="text-blue-600 font-medium text-sm flex items-center gap-1"
              whileHover={{ x: 5 }}
            >
              View Details
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
