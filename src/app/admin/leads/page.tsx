"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  interests: string[];
  createdAt: string;
}

export default function AdminLeadsPage() {
  // Since we're having issues with the Prisma client, let's use dummy data for now
  const dummyLeads: Lead[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      interests: ["Remote Jobs", "Tech Roles"],
      createdAt: "2025-08-15T10:30:00Z"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      interests: ["Visa Sponsorship", "Finance Roles"],
      createdAt: "2025-08-14T14:15:00Z"
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      interests: ["Remote Jobs", "Healthcare Roles"],
      createdAt: "2025-08-10T09:45:00Z"
    }
  ];

  const [leads, setLeads] = useState<Lead[]>(dummyLeads);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Removed loading/error states since we're using dummy data

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lead Management</h1>
      
      {leads.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No leads have been captured yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Interests</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{lead.name}</td>
                  <td className="py-3 px-4">{lead.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {lead.interests.map((interest) => (
                        <span 
                          key={interest} 
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {format(new Date(lead.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <h2 className="font-semibold text-blue-800">Implementation Note</h2>
        <p className="mt-2 text-blue-700">
          This is currently showing example data. Once the Prisma model issue is resolved,
          this page will connect to the real API to fetch actual lead data from the database.
        </p>
      </div>
    </div>
  );
}
