"use client";

import { motion } from "framer-motion";
import { Users, Globe, BriefcaseBusiness, Award } from "lucide-react";

export function PremiumStats() {
  const stats = [
    {
      id: 1,
      name: "Elite Professionals",
      value: "5,000+",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      description: "Vetted candidates"
    },
    {
      id: 2,
      name: "Global Companies",
      value: "100+",
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      description: "Offering visa sponsorship"
    },
    {
      id: 3,
      name: "Premium Positions",
      value: "2,500+",
      icon: <BriefcaseBusiness className="w-5 h-5 text-blue-500" />,
      description: "Exclusive opportunities"
    },
    {
      id: 4,
      name: "Success Rate",
      value: "85%",
      icon: <Award className="w-5 h-5 text-blue-500" />,
      description: "Placement efficiency"
    }
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                Premium Connections
              </span>
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Connecting elite African tech talent with world-class companies offering visa sponsorship
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="flex flex-col bg-white p-8"
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
                <dt className="text-sm font-semibold leading-6 text-gray-600 flex items-center justify-center gap-2">
                  {stat.icon}
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-blue-600">
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
