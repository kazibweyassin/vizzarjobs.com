"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught error:", error);
      setError(error.error);
      setHasError(true);
    };
    
    window.addEventListener("error", errorHandler);
    
    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);
  
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but there was an error loading this page. Our team has been notified.
          </p>
          {error && (
            <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-40">
              <p className="font-mono text-sm text-gray-700">{error.message}</p>
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => setHasError(false)} 
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
            <Link href="/" className="text-blue-600 text-center">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
