# Admin Access Setup for VizzarJobs

This document explains how to set up and access the admin dashboard in VizzarJobs.

## Admin Features

The admin dashboard provides the following capabilities:
- Review and approve company addition requests
- Manage companies and job listings
- View user information

## How to Access the Admin Dashboard

1. **Navigate to the Admin Dashboard**:
   - Go to `/admin` in your browser (e.g., http://localhost:3000/admin)

2. **Access Protection**:
   - The admin area is protected and only accessible to users with the ADMIN role
   - If you don't have admin rights, you'll see an "Access Denied" message

## Setting Up an Admin User

To give a user admin privileges, you need to update their role in the database:

### Option 1: Using SQL (Recommended)

1. Connect to your PostgreSQL database using a tool like pgAdmin or direct SQL access
2. Run the following SQL query, replacing the email with the user's email:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

### Option 2: Using Prisma Studio

1. Start Prisma Studio:
   ```bash
   npx prisma studio
   ```
2. Navigate to the User table
3. Find the user you want to make an admin
4. Change their role to 'ADMIN'
5. Save the changes

## Important Notes

- The admin role gives full access to sensitive information and operations
- Only grant admin access to trusted team members
- Admin actions are not currently logged, but this could be added in a future update

## Admin Pages

- `/admin` - Main dashboard
- `/admin/contact-requests` - Review company addition requests
- `/admin/companies` - Manage companies (coming soon)
- `/admin/users` - Manage users (coming soon)
