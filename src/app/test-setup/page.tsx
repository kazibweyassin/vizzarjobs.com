"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function TestSetupPage() {
  const [companyName, setCompanyName] = useState("Sample Test Company");
  const [companyDescription, setCompanyDescription] = useState("This is a test company for employee onboarding");
  const [companyWebsite, setCompanyWebsite] = useState("https://example.com");
  const [companyLogo, setCompanyLogo] = useState("https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=TC");
  const [companyIndustry, setCompanyIndustry] = useState("Technology");
  const [companyLocation, setCompanyLocation] = useState("New York, NY");
  const [companySize, setCompanySize] = useState("50-100");
  
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  
  const createTestCompanyMutation = api.companies.create.useMutation({
    onSuccess: () => {
      setStatus("Company created successfully!");
      setError("");
    },
    onError: (error) => {
      setStatus("Error creating company");
      setError(error.message);
    }
  });

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Creating company...");
    
    try {
    await createTestCompanyMutation.mutate({
      name: companyName,
      description: companyDescription || undefined,
      website: companyWebsite || undefined,
      logo: companyLogo || undefined,
      industry: companyIndustry || undefined,
      location: companyLocation || undefined,
      size: companySize || undefined,
      verified: true,
    });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Create Test Company</h1>
      
      <form onSubmit={handleCreateCompany} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="companyDescription"
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="text"
            id="companyWebsite"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL
          </label>
          <input
            type="text"
            id="companyLogo"
            value={companyLogo}
            onChange={(e) => setCompanyLogo(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="https://example.com/logo.png"
          />
        </div>
        
        <div>
          <label htmlFor="companyIndustry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            id="companyIndustry"
            value={companyIndustry}
            onChange={(e) => setCompanyIndustry(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="companyLocation"
            value={companyLocation}
            onChange={(e) => setCompanyLocation(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
            Company Size
          </label>
          <select
            id="companySize"
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="50-100">50-100</option>
            <option value="100-500">100-500</option>
            <option value="500-1000">500-1000</option>
            <option value="1000+">1000+</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {status && <p className="text-green-600">{status}</p>}
            {error && <p className="text-red-600">{error}</p>}
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Test Company
          </button>
        </div>
      </form>
    </div>
  );
}
