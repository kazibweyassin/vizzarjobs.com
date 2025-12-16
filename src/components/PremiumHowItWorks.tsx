"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  UserPlus, 
  FileCheck, 
  Briefcase, 
  Globe, 
  ArrowRight
} from "lucide-react";

export function PremiumHowItWorks() {
  const steps = [
    {
      id: 1,
      name: 'Create Your Profile',
      description: 'Complete your professional profile with skills, experience, and career preferences.',
      icon: UserPlus,
      color: 'bg-navy',
    },
    {
      id: 2,
      name: 'Browse Canadian Jobs',
      description: 'Explore opportunities from top employers across major Canadian cities.',
      icon: FileCheck,
      color: 'bg-navy',
    },
    {
      id: 3,
      name: 'Streamlined Application',
      description: 'Apply with ease and get direct connections with Canadian hiring managers.',
      icon: Briefcase,
      color: 'bg-navy',
    },
    {
      id: 4,
      name: 'Land Your Dream Job',
      description: 'Get hired by leading Canadian companies that value your skills and experience.',
      icon: Globe,
      color: 'bg-navy',
    },
  ];

  return (
    <div className="relative py-16 sm:py-24 overflow-hidden bg-gray-50">
      <div className="absolute inset-y-0 w-full h-80 xl:h-auto xl:w-1/2 xl:right-0">
        <div className="h-full w-full bg-white xl:rounded-l-lg relative">
          {/* Canadian map background image */}
          <div 
            className="absolute inset-0 bg-no-repeat bg-center bg-contain xl:bg-cover"
            style={{ 
              backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/East_Africa_regions_map.svg/1200px-East_Africa_regions_map.svg.png')",
              opacity: 0.15
            }}
          />
        </div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center xl:mx-0 xl:max-w-none xl:text-left">
          <div>
            <h2 className="text-base font-semibold leading-7 text-navy">Simple Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How VizzarJobs Works
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 mx-auto xl:mx-0 max-w-2xl">
              Our streamlined process connects qualified professionals with top employers across East Africa's thriving job market.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                className="rounded-lg bg-white shadow-sm border border-gray-100 p-8"
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
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${step.color} shadow-lg`}>
                      <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <span className="ml-4 text-4xl font-bold text-gray-300">0{step.id}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold leading-8 text-gray-900">{step.name}</h3>
                <p className="mt-2 text-base leading-7 text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 flex justify-center xl:justify-start">
            <Link 
              href="/profile" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-navy text-white hover:bg-navy/90 font-medium transition-colors"
            >
              Complete Your Profile
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
