// SuperCar Experience backend (ESM)
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

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const send = (res, code, data) => {
  res.writeHead(code, { 'Content-Type': 'application/json', ...CORS });
  res.end(JSON.stringify(data));
};

const parseJson = async (req) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    throw new Error('Invalid JSON');
  }
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });

  const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  const path = (pathname.replace(/\/+$/, '') || '/').replace(/^\/api(?=\/|$)/, '');
  console.log(`${req.method} ${path}`);

  const isAdmin = () => {
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    return ADMIN_TOKEN && token === ADMIN_TOKEN;
  };

  try {
    if (req.method === 'GET' && path === '/health') {
      return send(res, 200, { ok: true, service: 'supercar-experience' });
    }

    if (req.method === 'GET' && path === '/_debug/counts') {
      const rows = await sql`
        SELECT 'drivers' AS table, COUNT(*)::int AS count FROM drivers
        UNION ALL SELECT 'experiences', COUNT(*)::int FROM experiences
        UNION ALL SELECT 'thrill_reviews', COUNT(*)::int FROM thrill_reviews
        UNION ALL SELECT 'bookings', COUNT(*)::int FROM bookings
      `;
      return send(res, 200, rows);
    }

    // Drivers ---------------------------------------------------------------
    if (req.method === 'GET' && path === '/drivers') {
      const rows = await sql`SELECT * FROM drivers WHERE is_active = true ORDER BY experience_years DESC`;
      return send(res, 200, rows);
    }

    if (req.method === 'POST' && path === '/drivers') {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const d = await parseJson(req);
      const rows = await sql`
        INSERT INTO drivers (full_name, title, discipline_id, bio, certifications, experience_years, hero_car, image_url, email, phone, languages, is_active)
        VALUES (${d.full_name}, ${d.title}, ${d.discipline_id ?? null}, ${d.bio}, ${d.certifications}, ${d.experience_years}, ${d.hero_car}, ${d.image_url}, ${d.email}, ${d.phone}, ${d.languages}, ${d.is_active ?? true})
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (req.method === 'PUT' && path.startsWith('/drivers/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      const d = await parseJson(req);
      const rows = await sql`
        UPDATE drivers SET
          full_name = COALESCE(${d.full_name}, full_name),
          title = COALESCE(${d.title}, title),
          discipline_id = COALESCE(${d.discipline_id}, discipline_id),
          bio = COALESCE(${d.bio}, bio),
          certifications = COALESCE(${d.certifications}, certifications),
          experience_years = COALESCE(${d.experience_years}, experience_years),
          hero_car = COALESCE(${d.hero_car}, hero_car),
          image_url = COALESCE(${d.image_url}, image_url),
          email = COALESCE(${d.email}, email),
          phone = COALESCE(${d.phone}, phone),
          languages = COALESCE(${d.languages}, languages),
          is_active = COALESCE(${d.is_active}, is_active),
          updated_at = now()
        WHERE id = ${id}
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (req.method === 'DELETE' && path.startsWith('/drivers/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      await sql`DELETE FROM drivers WHERE id = ${id}`;
      return send(res, 200, { ok: true });
    }

    // Experiences -----------------------------------------------------------
    if (req.method === 'GET' && path === '/experiences') {
      const limitParam = parseInt(searchParams.get('limit') || '20', 10);
      const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 50 ? limitParam : 20;
      const rows = await sql`
        SELECT * FROM experiences
        WHERE is_active = true
        ORDER BY intensity_level DESC, created_at DESC
        LIMIT ${limit}`;
      return send(res, 200, rows);
    }

    if (req.method === 'POST' && path === '/experiences') {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const x = await parseJson(req);
      const rows = await sql`
        INSERT INTO experiences (name, description, track_layout, intensity_level, duration_minutes, price_range, location, max_cars, discipline_id, image_url, is_active)
        VALUES (${x.name}, ${x.description}, ${x.track_layout}, ${x.intensity_level}, ${x.duration_minutes}, ${x.price_range}, ${x.location}, ${x.max_cars}, ${x.discipline_id ?? null}, ${x.image_url}, ${x.is_active ?? true})
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (req.method === 'PUT' && path.startsWith('/experiences/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      const x = await parseJson(req);
      const rows = await sql`
        UPDATE experiences SET
          name = COALESCE(${x.name}, name),
          description = COALESCE(${x.description}, description),
          track_layout = COALESCE(${x.track_layout}, track_layout),
          intensity_level = COALESCE(${x.intensity_level}, intensity_level),
          duration_minutes = COALESCE(${x.duration_minutes}, duration_minutes),
          price_range = COALESCE(${x.price_range}, price_range),
          location = COALESCE(${x.location}, location),
          max_cars = COALESCE(${x.max_cars}, max_cars),
          discipline_id = COALESCE(${x.discipline_id}, discipline_id),
          image_url = COALESCE(${x.image_url}, image_url),
          is_active = COALESCE(${x.is_active}, is_active)
        WHERE id = ${id}
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (req.method === 'DELETE' && path.startsWith('/experiences/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      await sql`DELETE FROM experiences WHERE id = ${id}`;
      return send(res, 200, { ok: true });
    }

    // Reviews ---------------------------------------------------------------
    if (req.method === 'GET' && path === '/reviews') {
      const limitParam = parseInt(searchParams.get('limit') || '6', 10);
      const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 24 ? limitParam : 6;
      const rows = await sql`
        SELECT * FROM thrill_reviews
        WHERE is_approved = true
        ORDER BY created_at DESC
        LIMIT ${limit}`;
      return send(res, 200, rows);
    }

    if (req.method === 'PUT' && path.startsWith('/reviews/approve/')) {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[3];
      const rows = await sql`UPDATE thrill_reviews SET is_approved = true WHERE id = ${id} RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    // Bookings --------------------------------------------------------------
    if (path === '/bookings' && req.method === 'GET') {
      const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
      return send(res, 200, rows);
    }

    if (path === '/bookings' && req.method === 'POST') {
      const b = await parseJson(req);
      const errors = [];
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRe = /^[0-9+()\-\s]{7,}$/;
      if (!b.client_name || String(b.client_name).trim().length < 2) errors.push('client_name');
      if (!b.client_email || !emailRe.test(String(b.client_email))) errors.push('client_email');
      if (!b.client_phone || !phoneRe.test(String(b.client_phone))) errors.push('client_phone');
      if (!b.preferred_track_date) errors.push('preferred_track_date');
      if (!b.preferred_track_time) errors.push('preferred_track_time');
      if (errors.length) return send(res, 400, { error: 'Validation failed', fields: errors });

      const driverId = b.driver_id === '' ? null : (b.driver_id ?? null);
      const experienceId = b.experience_id === '' ? null : (b.experience_id ?? null);
      const participants = Number.isFinite(Number(b.participants_count)) ? Number(b.participants_count) : 1;

      const rows = await sql`
        INSERT INTO bookings
          (client_name, client_email, client_phone, driver_id, experience_id,
           preferred_track_date, preferred_track_time, participants_count, notes, status)
        VALUES
          (${b.client_name}, ${b.client_email}, ${b.client_phone},
           ${driverId}, ${experienceId},
           ${b.preferred_track_date}, ${b.preferred_track_time},
           ${participants}, ${b.notes ?? ''}, ${b.status ?? 'pending'})
        RETURNING *`;
      return send(res, 200, rows[0] ?? {});
    }

    if (path.startsWith('/bookings/') && req.method === 'PUT') {
      if (!isAdmin()) return send(res, 403, { error: 'Forbidden' });
      const id = path.split('/')[2];
      const b = await parseJson(req);
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
  } catch (error) {
    console.error('❌ Error:', error);
    const status = error.message === 'Invalid JSON' ? 400 : 500;
    return send(res, status, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`✅ SuperCar API ready on http://localhost:${PORT}`);
});
