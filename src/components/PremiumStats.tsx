"use client";

import { motion } from "framer-motion";
import { Users, Globe, BriefcaseBusiness, Award } from "lucide-react";

export function PremiumStats() {
  const stats = [
    {
      id: 1,
      name: "Active Professionals",
      value: "10,000+",
      icon: <Users className="w-5 h-5 text-navy" />,
      description: "Canadian job seekers"
    },
    {
      id: 2,
      name: "Canadian Companies",
      value: "500+",
      icon: <Globe className="w-5 h-5 text-navy" />,
      description: "Hiring on our platform"
    },
    {
      id: 3,
      name: "Available Positions",
      value: "1,200+",
      icon: <BriefcaseBusiness className="w-5 h-5 text-navy" />,
      description: "Across major cities"
    },
    {
      id: 4,
      name: "Placement Rate",
      value: "92%",
      icon: <Award className="w-5 h-5 text-navy" />,
      description: "Success within 30 days"
    }
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="text-navy">
                Canadian Job Market
              </span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Connecting qualified professionals with leading employers across Canada
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="flex flex-col bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: index * 0.1,
                    duration: 0.5
                  }
                }}
                viewport={{ once: true }}
              >
                <dt className="text-sm font-semibold leading-6 text-gray-700 flex items-center justify-center gap-2">
                  {stat.icon}
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-navy">
                  {stat.value}
                </dd>
                <p className="mt-2 text-sm text-gray-500">{stat.description}</p>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
