import { Action } from "rxjs/internal/scheduler/Action";
import pg from 'pg';
import 'dotenv/config';

async function testConnection() {
  console.log('Testing database connection...');
  console.log('URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@')); // Hide password

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    
    client.release();
  } catch (err: any) {
    console.error('Connection failed:', err.message);
    if (err.code) console.error('Error code:', err.code);
    if (err.cause) console.error('Cause:', err.cause);
  } finally {
    await pool.end();
  }
}

testConnection();
