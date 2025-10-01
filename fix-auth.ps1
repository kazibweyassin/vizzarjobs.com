# Quick Fix for Authentication Error
# Run this command in your terminal to set the required environment variables

# Set AUTH_SECRET (required for NextAuth.js)
$env:AUTH_SECRET = "your-super-secret-key-change-this-in-production-$(Get-Random)"

# Set NEXTAUTH_URL for development
$env:NEXTAUTH_URL = "http://localhost:3000"

# Set NODE_ENV
$env:NODE_ENV = "development"

# Display the values (for verification)
Write-Host "AUTH_SECRET: $env:AUTH_SECRET"
Write-Host "NEXTAUTH_URL: $env:NEXTAUTH_URL"
Write-Host "NODE_ENV: $env:NODE_ENV"

Write-Host "Environment variables set! Now restart your development server."
