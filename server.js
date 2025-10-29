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
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

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
    const isAdmin = () => {
      const auth = req.headers['authorization'] || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      return ADMIN_TOKEN && token === ADMIN_TOKEN;
    };
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

    if (req.method === 'POST' && path === '/guides') {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      let body = '';
      for await (const chunk of req) body += chunk;
      let g = {};
      try { g = JSON.parse(body || '{}'); } catch { return send(res, 400, { error: 'Invalid JSON' }); }
      const rows = await sql`
        INSERT INTO guides (full_name, title, specialty_id, bio, education, experience_years, image_url, email, phone, languages, is_active)
        VALUES (${g.full_name}, ${g.title}, ${g.specialty_id ?? null}, ${g.bio}, ${g.education}, ${g.experience_years}, ${g.image_url}, ${g.email}, ${g.phone}, ${g.languages}, ${g.is_active ?? true})
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (req.method === 'PUT' && path.startsWith('/guides/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      let body = '';
      for await (const chunk of req) body += chunk;
      let g = {};
      try { g = JSON.parse(body || '{}'); } catch { return send(res, 400, { error: 'Invalid JSON' }); }
      const rows = await sql`
        UPDATE guides SET
          full_name = COALESCE(${g.full_name}, full_name),
          title = COALESCE(${g.title}, title),
          specialty_id = COALESCE(${g.specialty_id}, specialty_id),
          bio = COALESCE(${g.bio}, bio),
          education = COALESCE(${g.education}, education),
          experience_years = COALESCE(${g.experience_years}, experience_years),
          image_url = COALESCE(${g.image_url}, image_url),
          email = COALESCE(${g.email}, email),
          phone = COALESCE(${g.phone}, phone),
          languages = COALESCE(${g.languages}, languages),
          is_active = COALESCE(${g.is_active}, is_active)
        WHERE id = ${id}
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (req.method === 'DELETE' && path.startsWith('/guides/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      await sql`DELETE FROM guides WHERE id = ${id}`;
      return send(res, 200, { ok: true });
    }

    if (req.method === 'GET' && path === '/tours') {
      const rows = await sql`SELECT * FROM tours WHERE is_active = true`;
      return send(res, 200, rows);
    }

    if (req.method === 'POST' && path === '/tours') {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      let body = '';
      for await (const chunk of req) body += chunk;
      let t = {};
      try { t = JSON.parse(body || '{}'); } catch { return send(res, 400, { error: 'Invalid JSON' }); }
      const rows = await sql`
        INSERT INTO tours (name, description, duration_days, price_range, destination, difficulty_level, max_participants, specialty_id, is_active)
        VALUES (${t.name}, ${t.description}, ${t.duration_days}, ${t.price_range}, ${t.destination}, ${t.difficulty_level}, ${t.max_participants}, ${t.specialty_id ?? null}, ${t.is_active ?? true})
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (req.method === 'PUT' && path.startsWith('/tours/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      let body = '';
      for await (const chunk of req) body += chunk;
      let t = {};
      try { t = JSON.parse(body || '{}'); } catch { return send(res, 400, { error: 'Invalid JSON' }); }
      const rows = await sql`
        UPDATE tours SET
          name = COALESCE(${t.name}, name),
          description = COALESCE(${t.description}, description),
          duration_days = COALESCE(${t.duration_days}, duration_days),
          price_range = COALESCE(${t.price_range}, price_range),
          destination = COALESCE(${t.destination}, destination),
          difficulty_level = COALESCE(${t.difficulty_level}, difficulty_level),
          max_participants = COALESCE(${t.max_participants}, max_participants),
          specialty_id = COALESCE(${t.specialty_id}, specialty_id),
          is_active = COALESCE(${t.is_active}, is_active)
        WHERE id = ${id}
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (req.method === 'DELETE' && path.startsWith('/tours/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      await sql`DELETE FROM tours WHERE id = ${id}`;
      return send(res, 200, { ok: true });
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

    if (req.method === 'PUT' && path.startsWith('/reviews/approve/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[3];
      const rows = await sql`UPDATE reviews SET is_approved = true WHERE id = ${id} RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (path === '/bookings' && req.method === 'GET') {
      const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
      return send(res, 200, rows);
    }

    if (path === '/bookings' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      let b = {};
      try { b = JSON.parse(body || '{}'); } catch { return send(res, 400, { error: 'Invalid JSON' }); }

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

    if (path.startsWith('/bookings/') && req.method === 'PUT') {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      let body = '';
      for await (const chunk of req) body += chunk;
      let b = {};
      try { b = JSON.parse(body || '{}'); } catch { return send(res, 400, { error: 'Invalid JSON' }); }
      const rows = await sql`
        UPDATE bookings SET
          status = COALESCE(${b.status}, status),
          notes = COALESCE(${b.notes}, notes)
        WHERE id = ${id}
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (path.startsWith('/bookings/') && req.method === 'DELETE') {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      await sql`DELETE FROM bookings WHERE id = ${id}`;
      return send(res, 200, { ok: true });
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
