"use client";

import { PrismaClient } from "@prisma/client";

// This component is for debugging only
export default function PrismaDebug() {
  const logPrismaModels = async () => {
    try {
      const prisma = new PrismaClient();
      
      // Log available models on the client
      console.log("Available models on PrismaClient:", 
        Object.keys(prisma).filter(key => 
          !key.startsWith('_') && 
          typeof prisma[key as keyof typeof prisma] === 'object'
        )
      );
      
      // Example query attempt
      try {
        const users = await prisma.user.findMany({ take: 1 });
        console.log("Users query successful:", users.length);
      } catch (err) {
        console.error("User query failed:", err);
      }
      
    } catch (err) {
      console.error("PrismaClient initialization failed:", err);
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Prisma Debug</h1>
      <button 
        onClick={logPrismaModels}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Log Prisma Models
      </button>
      <p className="mt-2 text-sm text-gray-500">Check browser console for output</p>
    </div>
  );
}
