"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Clock, X } from "lucide-react";
import { saveRecentSearch, getRecentSearches, type RecentSearch, removeRecentSearch } from "~/lib/recentSearches";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationField, setShowLocationField] = useState(false);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Tech skills suggestions
  const techSkills = [
    "React", "TypeScript", "JavaScript", "Python", "Node.js", 
    "AWS", "Docker", "Kubernetes", "GraphQL", "SQL",
    "Flutter", "SwiftUI", "Vue.js", "Angular", "Next.js"
  ];
  
  // Location suggestions
  const locations = [
    "Remote", "San Francisco", "New York", "London", "Berlin",
    "Toronto", "Sydney", "Singapore", "Paris", "Amsterdam"
  ];
  
  // Filter suggestions based on input
  const filteredSkillSuggestions = techSkills.filter(
    skill => skill.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
  
  // Filter location suggestions
  const filteredLocationSuggestions = locations.filter(
    loc => loc.toLowerCase().includes(location.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build the query string with search parameters
    const params = new URLSearchParams();
    
    if (query) {
      params.append("search", query);
    }
    
    if (location) {
      params.append("location", location);
    }

    // Save to recent searches
    saveRecentSearch(query, location);
    
    // Refresh the recent searches list
    setRecentSearches(getRecentSearches());
    
    // Navigate to the jobs page with search parameters
    router.push(`/jobs?${params.toString()}`);
  };
  
  // Use a recent search
  const handleRecentSearch = (search: RecentSearch) => {
    setQuery(search.query);
    if (search.location) {
      setLocation(search.location);
      setShowLocationField(true);
    } else {
      setLocation("");
    }
    setShowRecentSearches(false);
  };
  
  // Remove a recent search
  const handleRemoveRecentSearch = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click
    removeRecentSearch(index);
    setRecentSearches(getRecentSearches());
  };

  // Function to quickly set popular search terms
  const handlePopularSearch = (term: string) => {
    setQuery(term);
  };
  
  // Function to handle suggestion selection
  const handleSelectSkillSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSkillSuggestions(false);
  };
  
  // Function to handle location suggestion selection
  const handleSelectLocationSuggestion = (suggestion: string) => {
    setLocation(suggestion);
    setShowLocationSuggestions(false);
  };

  return (
    <div className="space-y-3">
      <form 
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-2 shadow-xl flex flex-col md:flex-row"
      >
        <div className="flex-1 flex items-center px-4 relative border-b md:border-b-0 md:border-r border-gray-100 py-2">
          <Search className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
          <div className="relative flex-1">
            <input 
              type="text" 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSkillSuggestions(e.target.value.length > 0);
                setShowRecentSearches(false);
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow clicking on them
                setTimeout(() => {
                  setShowSkillSuggestions(false);
                  setShowRecentSearches(false);
                }, 200);
              }}
              onFocus={() => {
                if (query) {
                  setShowSkillSuggestions(true);
                } else if (recentSearches.length > 0) {
                  setShowRecentSearches(true);
                }
              }}
              placeholder="Job title, company, or skills..." 
              className="w-full outline-none text-gray-700 text-lg py-3"
              required
            />
            
            {/* Skill Suggestions dropdown */}
            {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 bg-white mt-1 rounded-md shadow-lg z-10 border border-gray-200">
                {filteredSkillSuggestions.map((suggestion: string) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent triggering onBlur
                      handleSelectSkillSuggestion(suggestion);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-2">#</span>
                      {suggestion}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Recent Searches dropdown */}
            {showRecentSearches && recentSearches.length > 0 && !query && (
              <div className="absolute left-0 right-0 bg-white mt-1 rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-2 px-4 border-b border-gray-100">
                  <h3 className="text-xs font-medium uppercase text-gray-500">Recent Searches</h3>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={search.timestamp}
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent triggering onBlur
                      handleRecentSearch(search);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>
                          {search.query}
                          {search.location && <span className="text-gray-500 text-sm"> in {search.location}</span>}
                        </span>
                      </div>
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1"
                        onClick={(e) => handleRemoveRecentSearch(index, e)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setShowSkillSuggestions(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

      {showLocationField && (
        <div className="flex-1 flex items-center px-4 py-2 relative">
          <MapPin className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
          <div className="relative flex-1">
            <input 
              type="text" 
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowLocationSuggestions(e.target.value.length > 0);
              }}
              onBlur={() => {
                setTimeout(() => setShowLocationSuggestions(false), 200);
              }}
              onFocus={() => location && setShowLocationSuggestions(true)}
              placeholder="City, country, or remote..." 
              className="w-full outline-none text-gray-700 text-lg py-3"
            />
            
            {/* Location suggestions dropdown */}
            {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 bg-white mt-1 rounded-md shadow-lg z-10 border border-gray-200">
                {filteredLocationSuggestions.map((suggestion: string) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectLocationSuggestion(suggestion);
                    }}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                      {suggestion}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {location && (
            <button
              type="button"
              onClick={() => {
                setLocation("");
                setShowLocationSuggestions(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-2 px-2">
        <button 
          type="button" 
          onClick={() => setShowLocationField(!showLocationField)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-3 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <MapPin className="h-4 w-4" />
          {showLocationField ? "Hide location" : "Add location"}
        </button>
        
        <button 
          type="submit" 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
        >
          Search Jobs
        </button>
      </div>
    </form>
      
      {/* Popular searches */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-500">Popular:</span>
        {['Software Engineer', 'Data Scientist', 'Product Manager', 'UI/UX Designer', 'DevOps'].map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => handlePopularSearch(term)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
