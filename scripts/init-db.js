// Minimal DB initializer for SoutSide
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '..', '..', '.env') });

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set in .env');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function run() {
  try {
    const schema = readFileSync(resolve(__dirname, '..', 'database-schema.sql'), 'utf8');
    console.log('⏳ Applying database-schema.sql ...');
    await sql(schema);
    console.log('✅ Schema and seed applied.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Init DB failed:', e);
    process.exit(1);
  }
}

run();








