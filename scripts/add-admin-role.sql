-- Run this SQL in your Neon SQL Editor to add ADMIN to UserRole enum:

ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- Then run this to update your user:
UPDATE "User" SET role = 'ADMIN' WHERE email = 'kazibweusama@gmail.com';

-- Verify the update with:
SELECT id, name, email, role FROM "User" WHERE email = 'kazibweusama@gmail.com';
