// identify-tables.js
import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

// Load environment variables
dotenv.config();

// Extract connection parameters from DATABASE_URL
function parseConnectionString(connectionString) {
  // Basic parsing of the connection string
  const match = connectionString.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):?(\d*)\/([^?]+)/);
  
  if (!match) {
    throw new Error('Invalid connection string format');
  }
  
  const [, user, password, host, port = '5432', database] = match;
  
  return {
    user,
    password,
    host,
    port: parseInt(port, 10),
    database,
    ssl: { rejectUnauthorized: false } // Required for connecting to some PostgreSQL services
  };
}

async function listTables() {
  // Use the DATABASE_URL from .env file
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in your .env file');
    return;
  }
  
  // Parse the connection string
  const config = parseConnectionString(connectionString);
  
  // Create a new client
  const pool = new Pool({
    ...config,
    ssl: {
      rejectUnauthorized: false,
      sslmode: 'require'
    }
  });
  
  try {
    // Connect to PostgreSQL
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database!');
    
    // Query to get all table names in the public schema
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\nTables in the database:');
    res.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Query to specifically check for User-like tables
    console.log('\nChecking for User-related tables:');
    const userTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name ILIKE '%user%';
    `);
    
    if (userTables.rows.length === 0) {
      console.log('No User-related tables found');
    } else {
      userTables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    }
    
    // Release the client
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    // End the pool
    await pool.end();
  }
}

// Execute the function
listTables().catch(console.error);
