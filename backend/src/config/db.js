import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const useDatabase = String(process.env.USE_DATABASE || 'false').toLowerCase() === 'true';

export const pool = useDatabase
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
    })
  : null;

export async function query(text, params = []) {
  if (!pool) throw new Error('Banco desativado. USE_DATABASE=false.');
  return pool.query(text, params);
}
