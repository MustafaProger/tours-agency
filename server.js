// Tours Agency Backend Server (ESM)
import http from 'node:http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set in .env');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3001;

// CORS
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const send = (res, code, data) => {
  res.writeHead(code, { 'Content-Type': 'application/json', ...CORS });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });

  const { pathname } = new URL(req.url, 'http://localhost');
  const path = (pathname.replace(/\/+$/, '') || '/').replace(/^\/api(?=\/|$)/, '');
  console.log(`${req.method} ${path}`);

  try {
    // --- health ---
    if (req.method === 'GET' && path === '/health') {
      return send(res, 200, { ok: true });
    }

    // --- debug counts ---
    if (req.method === 'GET' && path === '/_debug/counts') {
      const rows = await sql`
        SELECT 'guides' AS table, COUNT(*)::int AS count FROM guides
        UNION ALL SELECT 'tours', COUNT(*)::int FROM tours
        UNION ALL SELECT 'reviews', COUNT(*)::int FROM reviews
        UNION ALL SELECT 'bookings', COUNT(*)::int FROM bookings
      `;
      return send(res, 200, rows);
    }

    // --- business routes ---
    if (req.method === 'GET' && path === '/guides') {
      const rows = await sql`SELECT * FROM guides WHERE is_active = true`;
      return send(res, 200, rows);
    }

    if (req.method === 'GET' && path === '/tours') {
      const rows = await sql`SELECT * FROM tours WHERE is_active = true`;
      return send(res, 200, rows);
    }

    if (req.method === 'GET' && path === '/reviews') {
      const rows = await sql`
        SELECT * FROM reviews
        WHERE is_approved = true
        ORDER BY created_at DESC
        LIMIT 6
      `;
      return send(res, 200, rows);
    }

    if (path === '/bookings' && req.method === 'GET') {
      const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
      return send(res, 200, rows);
    }

    if (path === '/bookings' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const b = JSON.parse(body);

      const rows = await sql`
        INSERT INTO bookings
          (client_name, client_email, client_phone, tour_id, guide_id,
           preferred_start_date, preferred_end_date, participants_count, notes, status)
        VALUES
          (${b.client_name}, ${b.client_email}, ${b.client_phone},
           ${b.tour_id}, ${b.guide_id},
           ${b.preferred_start_date}, ${b.preferred_end_date},
           ${b.participants_count}, ${b.notes}, 'pending')
        RETURNING *
      `;
      return send(res, 200, rows[0] ?? {});
    }

    return send(res, 404, { error: 'Not found', path });
  } catch (e) {
    console.error('❌ Error:', e);
    return send(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
