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
      name: 'Create Your Elite Profile',
      description: 'Complete your professional profile with skills, experience, and career preferences.',
      icon: UserPlus,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Apply to Premium Positions',
      description: 'Browse our exclusive visa-sponsored opportunities and apply with one click.',
      icon: FileCheck,
      color: 'bg-blue-600',
    },
    {
      id: 3,
      name: 'Fast-Track Application Process',
      description: 'Get priority processing and direct connections with hiring managers.',
      icon: Briefcase,
      color: 'bg-indigo-600',
    },
    {
      id: 4,
      name: 'Secure Global Placement',
      description: 'Receive visa sponsorship guidance and support throughout the relocation process.',
      icon: Globe,
      color: 'bg-blue-700',
    },
  ];

  return (
    <div className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-y-0 w-full h-80 xl:h-auto xl:w-1/2 xl:right-0">
        <div className="h-full w-full bg-gradient-to-tr from-indigo-50 to-blue-50 xl:rounded-l-3xl relative">
          {/* World map background image */}
          <div 
            className="absolute inset-0 bg-no-repeat bg-center bg-contain xl:bg-cover"
            style={{ 
              backgroundImage: "url('/map.svg')",
              mixBlendMode: "multiply",
              opacity: 0.15
            }}
          />
        </div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center xl:mx-0 xl:max-w-none xl:text-left">
          <div>
            <h2 className="text-base font-semibold leading-7 text-blue-600">Seamless Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How VizzarJobs Elite Works
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 mx-auto xl:mx-0 max-w-2xl">
              Our streamlined process connects elite African professionals with premium visa-sponsored positions globally.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                className="rounded-xl bg-white shadow-md ring-1 ring-slate-200 p-8"
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
              className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
            >
              Get Started Today
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
