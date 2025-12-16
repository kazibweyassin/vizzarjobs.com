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
      name: 'Quality Jobs',
      description: 'Curated positions from top employers across major East African cities.',
      icon: BadgeCheck,
    },
    {
      name: 'Leading Companies',
      description: 'Opportunities with East Africa\'s most innovative companies.',
      icon: Globe,
    },
    {
      name: 'Exclusive Employer Network',
      description: 'Direct access to positions from premium companies.',
      icon: Briefcase,
    },
    {
      name: 'Fast Application Process',
      description: 'Streamlined application process to help you land your dream job faster.',
      icon: Zap,
    },
    {
      name: 'Verified Profile System',
      description: 'Complete your profile to stand out to employers.',
      icon: Shield,
    },
    {
      name: 'Career Growth',
      description: 'Join a network of professionals thriving in East Africa.',
      icon: Award,
    },
  ];

  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-medium text-navy">East Africa Advantage</h2>
          <p className="mt-3 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for your career
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            VizzarJobs provides a focused platform connecting qualified professionals with top employers across East Africa.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <div className="mt-10 max-w-xl space-y-10 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.slice(0, 3).map((feature, index) => (
                    <motion.div 
                      key={feature.name} 
                      className="relative pl-12"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          delay: index * 0.1,
                          duration: 0.5,
                          ease: "easeOut"
                        }
                      }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-md bg-navy/10">
                        <feature.icon className="h-4 w-4 text-navy" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.name}</h3>
                        <p className="mt-2 text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            <motion.div 
              className="bg-white shadow-sm rounded-lg border border-gray-100 p-8 col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" }
              }}
              viewport={{ once: true }}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-md bg-navy/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-navy" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">East Africa Job Platform</h3>
                  </div>
                  <p className="text-gray-600 mb-8">
                    VizzarJobs is more than a job board. We're a curated community connecting qualified professionals with top employers across East Africa.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-navy mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Positions in major East African cities</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-navy mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Thoroughly vetted companies and positions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-navy mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">Profile completion increases visibility to employers</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/33.jpg" 
                      alt="Testimonial" 
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Emily Chen</p>
                      <p className="text-sm text-gray-500">Software Engineer @ Shopify</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">
                    "VizzarJobs helped me find the perfect position at a top company. The process was quick and efficient."
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="lg:pl-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <div className="mt-10 max-w-xl space-y-10 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.slice(3).map((feature, index) => (
                    <motion.div 
                      key={feature.name} 
                      className="relative pl-12"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { 
                          delay: index * 0.1,
                          duration: 0.5,
                          ease: "easeOut"
                        }
                      }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-md bg-navy/10">
                        <feature.icon className="h-4 w-4 text-navy" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.name}</h3>
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
