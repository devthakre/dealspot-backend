const API = 'http://localhost:3000';

// ── Fetch all offers ──────────────────
async function getOffers(category = 'all') {
  const res = await fetch(`${API}/offers?category=${category}`);
  return await res.json();
}

// ── Fetch single offer ────────────────
async function getOffer(id) {
  const res = await fetch(`${API}/offers/${id}`);
  return await res.json();
}

// ── Post new offer (business) ─────────
async function createOffer(data) {
  const res = await fetch(`${API}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// ── Get reviews ───────────────────────
async function getReviews(offerId) {
  const res = await fetch(`${API}/reviews/${offerId}`);
  return await res.json();
}

// ── Post review ───────────────────────
async function postReview(data) {
  const res = await fetch(`${API}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

// ── Register user ─────────────────────
async function registerUser(data) {
  const res = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}