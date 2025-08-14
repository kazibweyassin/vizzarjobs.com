"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Briefcase, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Plus,
  Search,
  Building2,
  Settings,
  FileText
} from "lucide-react";
import { Badge } from "~/components/ui/badge";

export function Navigation() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigation = [
    { name: "Jobs", href: "/jobs", icon: Search },
    { name: "Companies", href: "/companies", icon: Building2 },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-900">
                Vizzar<span className="text-blue-600">Jobs</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium px-2 py-1.5 rounded-md hover:bg-blue-50"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth & Actions */}
          <div className="hidden md:flex items-center gap-6">
            {session?.user.role === "EMPLOYER" && (
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Post Job
              </Link>
            )}

            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-9 h-9 rounded-full border-2 border-blue-100"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-semibold text-gray-900">
                      {session.user.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          session.user.role === "EMPLOYER" 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {session.user.role === "EMPLOYER" ? "Employer" : "Job Seeker"}
                      </Badge>
                    </div>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 overflow-hidden">
                    <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-gray-500">{session.user.email}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    
                    {session.user.role === "JOB_SEEKER" && (
                      <Link
                        href="/applications"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FileText className="w-4 h-4" />
                        My Applications
                      </Link>
                    )}
                    
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => signIn()}
                  className="text-gray-600 hover:text-blue-700 font-medium transition-colors px-2 py-1 hover:bg-blue-50 rounded-md"
                >
                  Sign In
                </button>
                <button
                  onClick={() => signIn()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-3 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-2 rounded-lg hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              
              {session ? (
                <div className="pt-4 border-t border-gray-100 space-y-4 mt-2">
                  <div className="flex items-center gap-3 px-2 py-2">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-10 h-10 rounded-full border-2 border-blue-100"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {session.user.name}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          session.user.role === "EMPLOYER" 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {session.user.role === "EMPLOYER" ? "Employer" : "Job Seeker"}
                      </Badge>
                    </div>
                  </div>
                  
                  {session.user.role === "EMPLOYER" && (
                    <Link
                      href="/post-job"
                      className="flex items-center gap-2 text-blue-600 font-medium py-3 px-2 rounded-lg hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="w-5 h-5" />
                      Post Job
                    </Link>
                  )}
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-gray-700 py-3 px-2 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>

                  <Link
                    href="/applications"
                    className="flex items-center gap-2 text-gray-700 py-3 px-2 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="w-5 h-5" />
                    My Applications
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 text-red-600 py-3 px-2 w-full text-left rounded-lg hover:bg-red-50 mt-2"
                  >
                    <LogOut className="w-5 h-5" />
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
                    className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium text-center shadow-md"
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
