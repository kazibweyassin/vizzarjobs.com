import { Building2, Contact, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Check if user is authenticated and has ADMIN role
  // We use type assertion here because we've updated the schema
  // but TypeScript types may not be up to date yet
  if (!session?.user || (session.user.role as string) !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-600">Admin Dashboard</h2>
          </div>
          
          <nav className="p-4 space-y-1">
            <Link 
              href="/admin"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            
            <Link 
              href="/admin/contact-requests"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600"
            >
              <Contact className="w-5 h-5" />
              Contact Requests
            </Link>
            
            <Link 
              href="/admin/companies"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600"
            >
              <Building2 className="w-5 h-5" />
              Companies
            </Link>
            
            <Link 
              href="/admin/users"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600"
            >
              <Users className="w-5 h-5" />
              Users
            </Link>
          </nav>
        </aside>

        {/* Admin Content */}
        <main className="flex-1 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
