const BASE = process.env.BASE_URL || 'http://localhost:3001';

async function run() {
  const health = await fetch(`${BASE}/health`).then((r) => r.json());
  console.log('health', health);

  const drivers = await fetch(`${BASE}/drivers`).then((r) => r.json());
  console.log('drivers', drivers.length);

  const experiences = await fetch(`${BASE}/experiences`).then((r) => r.json());
  console.log('experiences', experiences.length);

  const reviews = await fetch(`${BASE}/reviews`).then((r) => r.json());
  console.log('reviews', reviews.length);

  const bookings = await fetch(`${BASE}/bookings`).then((r) => r.json());
  console.log('bookings', bookings.length);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});











