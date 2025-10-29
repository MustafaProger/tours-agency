const BASE = process.env.BASE_URL || 'http://localhost:3001';

async function run() {
  const r1 = await fetch(`${BASE}/health`).then(r => r.json());
  console.log('health', r1);
  const guides = await fetch(`${BASE}/guides`).then(r => r.json());
  console.log('guides', guides.length);
  const tours = await fetch(`${BASE}/tours`).then(r => r.json());
  console.log('tours', tours.length);
  const reviews = await fetch(`${BASE}/reviews`).then(r => r.json());
  console.log('reviews', reviews.length);
  const bookings = await fetch(`${BASE}/bookings`).then(r => r.json());
  console.log('bookings', bookings.length);
}

run().catch(e => { console.error(e); process.exit(1); });




