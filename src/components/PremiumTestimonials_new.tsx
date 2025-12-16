"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export function PremiumTestimonials() {
  const testimonials = [
    {
      content: "VizzarJobs helped me find the perfect position in Kampala within weeks of completing my profile. The East Africa focus really makes a difference.",
      author: "Emily Chen",
      title: "Full Stack Developer",
      company: "Tech Company",
      location: "Kampala",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      content: "As a professional in East Africa, this platform was invaluable. Found a great position in Nairobi that matched my experience and skill set.",
      author: "Michael Singh",
      title: "Data Scientist",
      company: "Tech Company",
      location: "Nairobi",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      content: "The curated job listings for East African companies saved me so much time in my job search. I was able to find a role that aligned perfectly with my career goals.",
      author: "Sarah Tremblay",
      title: "UX Designer",
      company: "Tech Company",
      location: "Kigali",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-medium text-navy">Testimonials</h2>
          <p className="mt-2 text-3xl font-medium tracking-tight text-gray-900">
            Helping professionals find their dream jobs across East Africa
          </p>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from professionals who found their ideal positions through our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-sm rounded-md p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0, 
                transition: { 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }
              }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              
              <div className="relative">
                <Quote className="w-8 h-8 text-gray-200 absolute -top-3 -left-3 opacity-50" />
                <p className="text-gray-600 mb-6 relative">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center mt-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.title} at {testimonial.company}</p>
                  <p className="text-sm text-navy">{testimonial.location}, East Africa</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}