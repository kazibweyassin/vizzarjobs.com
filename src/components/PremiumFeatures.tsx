"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Globe, 
  Award, 
  Zap,
  CheckCircle,
  Briefcase,
  BadgeCheck
} from 'lucide-react';

export function PremiumFeatures() {
  const features = [
    {
      name: 'Curated Opportunities',
      description: 'Only the highest quality positions with competitive salaries and growth potential.',
      icon: BadgeCheck,
    },
    {
      name: 'Visa Sponsorship Guaranteed',
      description: 'Every position listed comes with full visa sponsorship support.',
      icon: Globe,
    },
    {
      name: 'Exclusive Employer Network',
      description: 'Access to positions from premium companies that value diversity.',
      icon: Briefcase,
    },
    {
      name: 'Fast-Track Applications',
      description: 'Skip the line with our priority application processing system.',
      icon: Zap,
    },
    {
      name: 'Verified Profile Badge',
      description: 'Stand out with our elite verification badge on your profile.',
      icon: Shield,
    },
    {
      name: 'Career Advancement',
      description: 'Join our elite network of professionals advancing their global careers.',
      icon: Award,
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Premium Experience</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to advance your global career
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            VizzarJobs offers an exclusive platform connecting elite African talent with premium global opportunities.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <div className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.slice(0, 3).map((feature, index) => (
                    <motion.div 
                      key={feature.name} 
                      className="relative pl-10"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          delay: index * 0.1,
                          duration: 0.5,
                          ease: [0.23, 1, 0.32, 1]
                        }
                      }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-lg shadow-md bg-blue-600">
                        <feature.icon className="h-4 w-4 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                        <p className="mt-2 text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            <motion.div 
              className="bg-white/60 backdrop-blur-sm shadow-xl rounded-2xl border border-blue-100/50 p-8 col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] }
              }}
              viewport={{ once: true }}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Premium Platform</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    VizzarJobs is more than a job board. We're a curated community of elite African professionals and premium employers offering visa sponsorship.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">100% of positions offer visa sponsorship</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">Thoroughly vetted companies and positions</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">Premium profile badges for verified candidates</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/44.jpg" 
                      alt="Testimonial" 
                      className="h-12 w-12 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sarah Mwangi</p>
                      <p className="text-sm text-gray-500">Senior Developer @ Microsoft</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm italic text-gray-600">
                    "VizzarJobs connected me with a life-changing opportunity. The visa sponsorship process was seamless."
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="lg:pl-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <div className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.slice(3).map((feature, index) => (
                    <motion.div 
                      key={feature.name} 
                      className="relative pl-10"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          delay: index * 0.1,
                          duration: 0.5,
                          ease: [0.23, 1, 0.32, 1]
                        }
                      }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-lg shadow-md bg-blue-600">
                        <feature.icon className="h-4 w-4 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                        <p className="mt-2 text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
