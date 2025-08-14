// This is a temporary fix for the AdapterError
// To use this file:
// 1. Stop your Next.js server
// 2. Delete the .next folder to clear cache: rm -rf .next
// 3. Run: node fix-auth-adapter.js
// 4. Restart your Next.js server: npm run dev

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create or update the .env.local file
function updateEnvLocal() {
  const envLocalPath = path.join(__dirname, '.env.local');
  
  // Generate a new AUTH_SECRET
  const newAuthSecret = crypto.randomBytes(32).toString('base64');
  
  // Content to write or append
  const content = `
# Auth configuration - updated to fix adapter error
AUTH_SECRET="${newAuthSecret}"
`;

  try {
    // Check if file exists
    if (fs.existsSync(envLocalPath)) {
      // Read existing content
      let existingContent = fs.readFileSync(envLocalPath, 'utf8');
      
      // Check if AUTH_SECRET is already in the file
      if (existingContent.includes('AUTH_SECRET=')) {
        // Replace existing AUTH_SECRET line
        existingContent = existingContent.replace(
          /AUTH_SECRET=.*/g,
          `AUTH_SECRET="${newAuthSecret}"`
        );
        fs.writeFileSync(envLocalPath, existingContent);
      } else {
        // Append new AUTH_SECRET
        fs.appendFileSync(envLocalPath, content);
      }
    } else {
      // Create new file
      fs.writeFileSync(envLocalPath, content);
    }
    
    console.log('✅ Successfully updated .env.local with a new AUTH_SECRET');
  } catch (error) {
    console.error('❌ Error updating .env.local:', error);
  }
}

// Clear cache folders
function clearCache() {
  const nextCacheDir = path.join(__dirname, '.next');
  
  try {
    if (fs.existsSync(nextCacheDir)) {
      console.log('🗑️ Removing .next folder to clear cache...');
      // Note: This is a simplistic approach. In a real script, you would need 
      // a recursive directory removal function for Windows compatibility
      console.log('Please manually delete the .next folder before restarting your server');
    }
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
}

// Main execution
function main() {
  console.log('🔧 Starting auth adapter fix...');
  
  // Update .env.local with new AUTH_SECRET
  updateEnvLocal();
  
  // Clear cache
  clearCache();
  
  console.log('\n📋 Next steps:');
  console.log('1. Manually delete the .next folder: rm -rf .next');
  console.log('2. Restart your Next.js server: npm run dev');
  console.log('3. Clear your browser cookies and try logging in again');
}

main();
