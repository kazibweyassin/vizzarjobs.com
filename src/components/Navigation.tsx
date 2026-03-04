"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
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
  Shield,
} from "lucide-react";

export function Navigation() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Browse Jobs", href: "/jobs" },
    { name: "Visa Sponsored", href: "/jobs?visaSponsorship=true", highlight: true },
    { name: "Companies", href: "/companies" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/jobs" || href.startsWith("/jobs?")) return pathname.startsWith("/jobs");
    return pathname === href;
  };

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "U";
  const isEmployer = session?.user?.role === "EMPLOYER";
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <>
      <nav
        className={`sticky top-0 z-[100] bg-[#0F2C4C] border-b border-white/10 transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-black/20" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <Image
                src="/logowhite.png"
                alt="VizzarJobs"
                width={36}
                height={36}
                priority
                className="h-9 w-auto"
              />
              <span className="hidden sm:block text-white font-bold text-lg tracking-tight group-hover:text-amber-300 transition-colors">
                Vizzar<span className="text-amber-400">Jobs</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                if (link.highlight) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="inline-flex items-center gap-1.5 mx-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 hover:text-amber-200 transition-all"
                    >
                      <Plane className="w-3.5 h-3.5" />
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      active
                        ? "text-white bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
              {(isEmployer || isAdmin) && (
                <Link
                  href="/post-job"
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    pathname === "/post-job"
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Post a Job
                  {pathname === "/post-job" && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </Link>
              )}
            </div>

            {/* Desktop auth */}
            <div className="hidden lg:flex items-center gap-2">
              {status === "loading" ? (
                <div className="w-32 h-8 bg-white/10 rounded-lg animate-pulse" />
              ) : !session ? (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm"
                  >
                    Get started
                  </Link>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name ?? "User"}
                        className="w-8 h-8 rounded-full object-cover border-2 border-amber-400/50"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-amber-400/50">
                        <span className="text-[#0F2C4C] font-bold text-sm">{userInitial}</span>
                      </div>
                    )}
                    <div className="text-left hidden xl:block">
                      <div className="text-sm font-semibold text-white leading-none">
                        {session.user.name?.split(" ")[0]}
                      </div>
                      <div className="text-xs text-white/50 mt-0.5 capitalize">
                        {isAdmin ? "Admin" : isEmployer ? "Employer" : "Job Seeker"}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile dropdown */}
                  <div
                    className={`absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[110] transition-all duration-150 origin-top-right ${
                      isProfileDropdownOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        {isAdmin ? "Admin" : isEmployer ? "Employer" : "Job Seeker"}
                      </span>
                    </div>

                    <div className="py-1">
                      {(isEmployer || isAdmin) && (
                        <Link
                          href="/dashboard/employer"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F2C4C]"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          Dashboard
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F2C4C]"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Shield className="w-4 h-4 text-amber-500" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F2C4C]"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        My Profile
                      </Link>
                      {!isEmployer && !isAdmin && (
                        <Link
                          href="/applications"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F2C4C]"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          My Applications
                        </Link>
                      )}
                      <Link
                        href="/settings"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0F2C4C]"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              {session && (
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-2 border-amber-400/50 overflow-hidden">
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#0F2C4C] font-bold text-sm">{userInitial}</span>
                  )}
                </div>
              )}
              <button
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile overlay backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile slide-in drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[95] w-72 bg-[#0F2C4C] lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 flex-shrink-0">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
            <Image src="/logowhite.png" alt="VizzarJobs" width={28} height={28} className="h-7 w-auto" />
            <span className="text-white font-bold">
              Vizzar<span className="text-amber-400">Jobs</span>
            </span>
          </Link>
          <button
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable links area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">

          {/* User card */}
          {session && (
            <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-white/5 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-amber-400/50 shrink-0 overflow-hidden bg-amber-500">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#0F2C4C] font-bold">{userInitial}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{session.user.name}</div>
                <div className="text-xs text-white/50 truncate">{session.user.email}</div>
                <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {isAdmin ? "Admin" : isEmployer ? "Employer" : "Job Seeker"}
                </span>
              </div>
            </div>
          )}

          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30 pb-1">
            Navigate
          </p>

          {navLinks.map((link) => {
            const active = isActive(link.href);
            if (link.highlight) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                >
                  <Plane className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            }
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
                {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </Link>
            );
          })}

          {(isEmployer || isAdmin) && (
            <Link
              href="/post-job"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                pathname === "/post-job"
                  ? "bg-white/15 text-white"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              }`}
            >
              Post a Job
              {pathname === "/post-job" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </Link>
          )}

          {/* Account section */}
          {session && (
            <>
              <div className="pt-4 pb-1">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Account
                </p>
              </div>
              {(isEmployer || isAdmin) && (
                <Link
                  href="/dashboard/employer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-white/40" />
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  Admin Panel
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all"
              >
                <User className="w-4 h-4 text-white/40" />
                My Profile
              </Link>
              {!isEmployer && !isAdmin && (
                <Link
                  href="/applications"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                >
                  <Briefcase className="w-4 h-4 text-white/40" />
                  My Applications
                </Link>
              )}
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/75 hover:text-white rounded-lg hover:bg-white/10 transition-all"
              >
                <Settings className="w-4 h-4 text-white/40" />
                Settings
              </Link>
            </>
          )}
        </div>

        {/* Drawer footer: auth buttons */}
        <div className="px-3 pb-6 pt-3 border-t border-white/10 flex-shrink-0 space-y-2">
          {session ? (
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          ) : (
            <>
              <Link
                href="/auth/signin"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0F2C4C] font-bold py-2.5 rounded-lg text-sm transition-all"
              >
                Get started — it&apos;s free
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
