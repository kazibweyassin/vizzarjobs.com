// Execute this SQL in your PostgreSQL database to upgrade a user to admin:
// Replace 'your-email@example.com' with the email of the user you want to make an admin

UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
