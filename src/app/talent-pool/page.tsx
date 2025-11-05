"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Globe, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  Zap,
  Sparkles,
  TrendingUp,
  Lock,
  Headphones,
  Brain,
  Code,
  Database
} from 'lucide-react';
import Link from 'next/link';

export default function TalentPoolLandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Brain,
      title: "Tech Excellence",
      description: "Connect with Canada's leading tech companies and innovative startups across all specializations",
      color: "bg-blue-50"
    },
    {
      icon: Globe,
      title: "Canada Focus",
      description: "Exclusive opportunities with Canadian companies offering visa sponsorship",
      color: "bg-green-50"
    },
    {
      icon: Code,
      title: "Smart Matching",
      description: "Our AI matches your skills with roles that align with your career goals",
      color: "bg-purple-50"
    },
    {
      icon: FileText,
      title: "Portfolio Showcase",
      description: "Highlight your projects, research, and GitHub to stand out to employers",
      color: "bg-orange-50"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Enterprise-grade security with complete control over your personal data",
      color: "bg-gray-50"
    },
    {
      icon: Zap,
      title: "Fast Track",
      description: "Skip the application queue with direct access to hiring managers",
      color: "bg-yellow-50"
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Visa Sponsorship",
      description: "All opportunities include Canadian work visa sponsorship"
    },
    {
      icon: Star,
      title: "Premium Companies",
      description: "Access to Canada's most innovative tech companies"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Opportunities for rapid career advancement and skill development"
    },
    {
      icon: Lock,
      title: "Secure Process",
      description: "Your information is protected with enterprise-grade security"
    }
  ];

  const stats = [
    { number: "500+", label: "Tech Professionals", icon: Users },
    { number: "50+", label: "Canadian Companies", icon: Briefcase },
    { number: "95%", label: "Success Rate", icon: CheckCircle },
    { number: "Canada", label: "Primary Focus", icon: Globe }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Tech Talent Pool • Canada Focus
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
            >
              Join Canada's
              <br />
              <span className="text-blue-600">Elite Tech Talent</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with Canada's most innovative tech companies. 
              <br />
              Where exceptional talent meets exceptional opportunities across all tech specializations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Link
                href="/talent-pool/register"
                className="group inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Join Our Talent Pool
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/jobs?location=Canada"
                className="inline-flex items-center gap-3 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                Browse Tech Jobs
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Join Our Talent Pool?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We connect exceptional tech professionals with Canada's most innovative companies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What You Get
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Exclusive benefits for our tech talent pool members
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Join?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join Canada's most exclusive tech talent pool and connect with innovative companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/talent-pool/register"
                className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}