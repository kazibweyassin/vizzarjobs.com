"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Shield } from 'lucide-react';

export function PremiumTestimonials() {
  const testimonials = [
    {
      content: "VizzarJobs completely changed my career trajectory. Within weeks of signing up, I received an offer from a Fortune 500 company with full visa sponsorship.",
      author: "David Omondi",
      role: "Senior Software Engineer",
      company: "Microsoft",
      location: "Seattle, USA",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5
    },
    {
      content: "The quality of opportunities on VizzarJobs is unmatched. The platform's focus on visa sponsorship removed the biggest barrier in my international job search.",
      author: "Amara Nwosu",
      role: "Product Manager",
      company: "Shopify",
      location: "Toronto, Canada",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      content: "What sets VizzarJobs apart is their elite vetting process. Every position I applied to was legitimate, with clear visa sponsorship details and competitive compensation.",
      author: "Kwame Mensah",
      role: "DevOps Engineer",
      company: "Atlassian",
      location: "Sydney, Australia",
      image: "https://randomuser.me/api/portraits/men/86.jpg",
      rating: 5
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Success Stories</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Transforming Careers Globally
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute -left-16 -top-16 hidden lg:block">
            <Quote className="h-32 w-32 text-blue-50 rotate-180" />
          </div>
          
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="px-6 py-12 sm:px-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3">
                    <div className="flex items-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-5 w-5 text-yellow-400 fill-yellow-400" 
                          aria-hidden="true" 
                        />
                      ))}
                    </div>
                    <p className="text-xl text-gray-700 italic leading-relaxed">
                      "{testimonials[activeIndex].content}"
                    </p>

                    <div className="mt-10 flex items-center gap-4">
                      <img
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].author}
                        className="h-14 w-14 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          {testimonials[activeIndex].author}
                          <span className="flex items-center bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                            <Shield className="h-3 w-3 text-blue-600 mr-1" />
                            <span className="text-xs font-medium text-blue-700">Verified</span>
                          </span>
                        </h4>
                        <p className="text-sm text-gray-500">
                          {testimonials[activeIndex].role} @ {testimonials[activeIndex].company}
                        </p>
                        <p className="text-sm text-blue-600">{testimonials[activeIndex].location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:flex lg:col-span-2 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <div className="text-center py-8 px-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full premium-gradient flex items-center justify-center">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Elite Opportunity</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Every testimonial represents a successful career transition with full visa sponsorship
                      </p>
                      <div className="inline-block bg-white rounded-full px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
                        100% Visa Sponsorship Success Rate
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Controls */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-blue-600 shadow-sm hover:bg-blue-700 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
            
            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 w-2 rounded-full ${
                    index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className="sr-only">View testimonial {index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
