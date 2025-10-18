"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  User,
  FileText,
  Menu,
  X
} from "lucide-react";
import { Badge } from "~/components/ui/badge";

// Update this type to match the UserRole enum in the Prisma schema
type UserRole = "USER" | "JOB_SEEKER" | "EMPLOYER" | "EMPLOYEE" | "ADMIN";

export function Navigation() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigation = [
    { name: "Talent Pool", href: "/talent-pool" },
    { name: "Career Assessment", href: "/career-assessment" },
    { name: "Insights", href: "/insights" },
    { name: "Resources", href: "/resources" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 min-w-0">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/logowhite.png"
                  alt="VizzarJobs"
                  width={40}
                  height={40}
                  priority
                  className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"  
                />
                <div className="absolute inset-0 bg-blue-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center text-slate-300 hover:text-white transition-all duration-300 font-medium px-4 py-2 rounded-xl hover:bg-slate-800/50 text-sm lg:text-base relative overflow-hidden"
                >
                  <span className="font-semibold">{item.name}</span>
                  <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl"></div>
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth & Actions */}
          <div className="hidden md:flex items-center gap-3 xl:gap-4">
            {/* Useful navigation buttons based on user role */}
            {session?.user && (
              <>
                {session.user.role === "JOB_SEEKER" && (
                  <Link
                    href="/jobs"
                    className="group inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm xl:text-base shadow-lg"
                  >
                    <span className="hidden lg:inline">Browse Jobs</span>
                    <span className="lg:hidden">Jobs</span>
                  </Link>
                )}
                
                {(session.user.role === "EMPLOYER" || session.user.role === "ADMIN") && (
                  <Link
                    href="/dashboard/employer"
                    className="group inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm xl:text-base shadow-lg"
                  >
                    <span className="hidden lg:inline">Dashboard</span>
                    <span className="lg:hidden">Dashboard</span>
                  </Link>
                )}
              </>
            )}
            
            {/* Profile Button */}
            {status === "loading" ? (
              <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
            ) : !session ? (
              <Link
                href="/auth/signin"
                className="group inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm xl:text-base shadow-lg"
              >
                <span className="hidden lg:inline">Get Started</span>
                <span className="lg:hidden">Sign In</span>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200 hover:shadow-sm"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-10 h-10 rounded-xl border-2 border-white shadow-sm group-hover:shadow-md transition-all duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                      <span className="text-white font-bold">
                        {session.user.name?.[0] || "U"}
                      </span>
                    </div>
                  )}
                  <div className="text-left hidden xl:block min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate max-w-32">
                      {session.user.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge 
                        className={`text-xs font-semibold ${
                          session.user.role === "EMPLOYER" || session.user.role === "ADMIN"
                            ? "bg-green-500 text-white border-0" 
                            : "bg-blue-500 text-white border-0"
                        }`}
                      >
                        {session.user.role === "EMPLOYER" || session.user.role === "ADMIN" ? "Employer" : "Job Seeker"}
                      </Badge>
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-slate-600 truncate">{session.user.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      Profile
                    </Link>
                    
                    {session.user.role === "JOB_SEEKER" && (
                      <Link
                        href="/applications"
                        className="flex items-center gap-3 px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        My Applications
                      </Link>
                    )}
                    
                    {!session.user.profileComplete && (
                      <Link
                        href="/onboarding"
                        className="flex items-center gap-3 px-6 py-3 text-sm text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-200 bg-blue-50/50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Create Your Profile
                      </Link>
                    )}
                    
                    {(session.user.role === "EMPLOYEE" || session.user.role === "EMPLOYER" || session.user.role === "ADMIN") && session.user.profileComplete && (
                      <Link
                        href="/onboarding"
                        className="flex items-center gap-3 px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Employee Onboarding
                      </Link>
                    )}
                    
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    
                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 font-medium rounded-lg mx-2"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
          <div className="md:hidden border-t border-slate-700/20 py-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2 px-4">
              {navigation.map((item) => {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center text-slate-300 hover:text-white transition-all duration-200 font-medium py-3 px-4 rounded-lg hover:bg-slate-800/50 hover:shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-semibold">{item.name}</span>
                  </Link>
                );
              })}
              
              {session ? (
                <div className="pt-4 border-t border-slate-700/20 space-y-2 mt-4">
                  <div className="flex items-center gap-3 px-2 py-2">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-10 h-10 rounded-full border-2 border-blue-100"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {session.user.name?.[0] || "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {session.user.name}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          session.user.role === "EMPLOYER" || session.user.role === "ADMIN"
                            ? "bg-blue-50 text-blue-700 border-blue-200" 
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {session.user.role === "EMPLOYER" || session.user.role === "ADMIN" ? "Employer" : "Job Seeker"}
                      </Badge>
                    </div>
                  </div>
                  
                  {(session.user.role === "EMPLOYER" || session.user.role === "ADMIN") && (
                    <Link
                      href="/post-job"
                      className="flex items-center gap-2 text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Post Job
                    </Link>
                  )}
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-gray-700 py-3 px-2 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    href="/applications"
                    className="flex items-center gap-2 text-gray-700 py-3 px-2 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Applications
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 text-red-600 py-3 px-2 w-full text-left rounded-lg hover:bg-red-50 mt-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 space-y-3 px-2 mt-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signIn();
                    }}
                    className="block w-full text-left text-gray-700 font-medium py-3 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signIn();
                    }}
                    className="block w-full px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors text-center"
                  >
                    Join Now
                  </button>
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
