"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Briefcase,
  LayoutDashboard,
  Plane,
} from "lucide-react";

export function Navigation() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Browse Jobs", href: "/jobs" },
    { name: "Visa Sponsored", href: "/jobs?visaSponsorship=true" },
    { name: "Companies", href: "/companies" },
    { name: "Post a Job", href: "/post-job" },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-[100] bg-[#0F2C4C] border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logowhite.png"
              alt="VizzarJobs"
              width={36}
              height={36}
              priority
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isVisa = link.name === "Visa Sponsored";
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={
                    isVisa
                      ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                      : "px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  }
                >
                  {isVisa && <Plane className="w-3.5 h-3.5" />}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: auth */}
          <div className="hidden lg:flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-white/10 rounded-lg animate-pulse" />
            ) : !session ? (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold text-sm px-5 py-2 rounded-lg transition-all shadow-sm"
                >
                  <User className="w-4 h-4" />
                  Get started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-lg object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                      <span className="text-[#0F2C4C] font-bold text-sm">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white leading-none">
                      {session.user.name?.split(" ")[0]}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      {session.user.role === "EMPLOYER" || session.user.role === "ADMIN"
                        ? "Employer"
                        : "Job Seeker"}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/50" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[110]">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <div className="py-1">
                      {(session.user.role === "EMPLOYER" || session.user.role === "ADMIN") && (
                        <Link
                          href="/dashboard/employer"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Profile
                      </Link>
                      {session.user.role === "JOB_SEEKER" && (
                        <Link
                          href="/applications"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          My Applications
                        </Link>
                      )}
                      <Link
                        href="/settings"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => { setIsProfileDropdownOpen(false); void handleSignOut(); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 space-y-1">
            {navLinks.map((link) => {
              const isVisa = link.name === "Visa Sponsored";
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    isVisa
                      ? "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-amber-300 bg-amber-500/10"
                      : "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10"
                  }
                >
                  {isVisa && <Plane className="w-4 h-4" />}
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-white/10 space-y-2">
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
                    <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-[#0F2C4C] font-bold">
                        {session.user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{session.user.name}</div>
                      <div className="text-xs text-white/50">{session.user.email}</div>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {session.user.role === "JOB_SEEKER" && (
                    <Link href="/applications" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                      <Briefcase className="w-4 h-4" /> My Applications
                    </Link>
                  )}
                  <button
                    onClick={() => { setIsMenuOpen(false); void handleSignOut(); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full rounded-lg"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg">
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold py-3 rounded-lg text-sm transition-all"
                  >
                    <User className="w-4 h-4" />
                    Get started â€” it&apos;s free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isProfileDropdownOpen && (
        <div className="fixed inset-0 z-[105]" onClick={() => setIsProfileDropdownOpen(false)} />
      )}
    </nav>
  );
}
