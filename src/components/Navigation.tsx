"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  User,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Briefcase,
  Brain,
  Target,
  BookOpen,
  Info,
  Package
} from "lucide-react";

// Update this type to match the UserRole enum in the Prisma schema
type UserRole = "USER" | "JOB_SEEKER" | "EMPLOYER" | "EMPLOYEE" | "ADMIN";

export function Navigation() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigation = [
    { name: "Talent Pool", href: "/talent-pool", icon: Target },
    { name: "Career Assessment", href: "/career-assessment", icon: Brain },
    { name: "Insights", href: "/insights", icon: BookOpen },
    { name: "Resources", href: "/resources", icon: Info },
    { name: "Products", href: "/products", icon: Package },
    { name: "About Us", href: "/about", icon: Info },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logowhite.png"
                alt="VizzarJobs"
                width={40}
                height={40}
                priority
                className="h-10 w-auto"  
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-200"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Useful navigation buttons based on user role */}
            {session?.user && (
              <>
                {session.user.role === "JOB_SEEKER" && (
                  <Link
                    href="/jobs?location=Canada&category=AI-ML"
                    className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Link>
                )}
                
                {(session.user.role === "EMPLOYER" || session.user.role === "ADMIN") && (
                  <Link
                    href="/dashboard/employer"
                    className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                )}
              </>
            )}
            
            {/* Profile Button */}
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            ) : !session ? (
              <Link
                href="/auth/signin"
                className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 text-sm shadow-sm hover:shadow-md"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {session.user.name?.[0] || "U"}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {session.user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {session.user.role === "EMPLOYER" || session.user.role === "ADMIN" ? "Employer" : "Job Seeker"}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50 backdrop-blur-md">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-gray-600">{session.user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      
                      {session.user.role === "JOB_SEEKER" && (
                        <Link
                          href="/applications"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Briefcase className="w-4 h-4" />
                          My Applications
                        </Link>
                      )}
                      
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {session ? (
                <div className="pt-4 border-t border-gray-200/50 space-y-1 mt-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 rounded-xl">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-medium">
                          {session.user.name?.[0] || "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {session.user.role === "EMPLOYER" || session.user.role === "ADMIN" ? "Employer" : "Job Seeker"}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>

                  {session.user.role === "JOB_SEEKER" && (
                    <Link
                      href="/applications"
                      className="flex items-center gap-3 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Briefcase className="w-5 h-5" />
                      My Applications
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 text-red-600 py-3 px-4 w-full text-left rounded-xl hover:bg-red-50/50"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200/50 space-y-3 mt-4">
                  <Link
                    href="/auth/signin"
                    className="block w-full text-left text-gray-700 font-medium py-3 px-4 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition-all duration-200 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </nav>
  );
}