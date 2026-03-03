const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
const app = express();

app.use(cors());
app.use(express.json());

// ── Default Data ──────────────────────
db.defaults({
  users: [],
  businesses: [],
  offers: [
    { id:1, name:"Summer Blowout Sale", business:"Zara", category:"retail", discount:"30%", description:"Off all summer collection", distance:"180m", hours:"Open now", timer:"2h 14m", views:1200, active:true },
    { id:2, name:"Free Drink on Any Meal", business:"Burger Lab", category:"food", discount:"Free", description:"Any soft drink with order", distance:"320m", hours:"11am–11pm", timer:"45m", views:847, active:true },
    { id:3, name:"Ladies Night 2-for-1", business:"Skybar Lounge", category:"event", discount:"2for1", description:"All cocktails tonight only", distance:"600m", hours:"8pm–2am", timer:"4h 30m", views:3400, active:true },
    { id:4, name:"Haircut + Style Deal", business:"Studio One", category:"service", discount:"40%", description:"Full cut and blowdry", distance:"410m", hours:"9am–9pm", timer:"1h 52m", views:522, active:true },
    { id:5, name:"End of Season Clearance", business:"H&M", category:"retail", discount:"50%", description:"Selected items only", distance:"250m", hours:"Open now", timer:"3h 10m", views:2100, active:true },
  ],
  reviews: [
    { id:1, offerId:1, user:"Sara M.", stars:5, text:"Amazing deal! Saved so much.", date:"2 days ago" },
    { id:2, offerId:1, user:"James K.", stars:4, text:"Great app, very convenient!", date:"3 days ago" },
  ]
}).write();

// ── ROUTES ────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({ status: '✅ Dealspot backend is running!', time: new Date() });
});

// GET all offers
app.get('/offers', (req, res) => {
  const { category } = req.query;
  let offers = db.get('offers').filter({ active: true }).value();
  if (category && category !== 'all') {
    offers = offers.filter(o => o.category === category);
  }
  res.json(offers);
});

// GET single offer
app.get('/offers/:id', (req, res) => {
  const offer = db.get('offers').find({ id: parseInt(req.params.id) }).value();
  if (!offer) return res.status(404).json({ error: 'Offer not found' });
  res.json(offer);
});

// POST create offer (business)
app.post('/offers', (req, res) => {
  const offer = {
    id: Date.now(),
    ...req.body,
    views: 0,
    active: true,
    createdAt: new Date().toISOString()
  };
  db.get('offers').push(offer).write();
  res.json({ success: true, offer });
});

// PUT update offer
app.put('/offers/:id', (req, res) => {
  db.get('offers').find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.json({ success: true });
});

// DELETE offer
app.delete('/offers/:id', (req, res) => {
  db.get('offers').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

// GET all businesses
app.get('/businesses', (req, res) => {
  res.json(db.get('businesses').value());
});

// POST register business
app.post('/businesses', (req, res) => {
  const biz = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  db.get('businesses').push(biz).write();
  res.json({ success: true, business: biz });
});

// GET reviews for an offer
app.get('/reviews/:offerId', (req, res) => {
  const reviews = db.get('reviews').filter({ offerId: parseInt(req.params.offerId) }).value();
  res.json(reviews);
});

// POST add review
app.post('/reviews', (req, res) => {
  const review = { id: Date.now(), ...req.body, date: 'Just now' };
  db.get('reviews').push(review).write();
  res.json({ success: true, review });
});

// POST register user
app.post('/users', (req, res) => {
  const existing = db.get('users').find({ email: req.body.email }).value();
  if (existing) return res.json({ success: true, user: existing });
  const user = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  db.get('users').push(user).write();
  res.json({ success: true, user });
});

// ── START SERVER ──────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Dealspot backend running!');
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log('📦 Database: db.json (local file)');
  console.log('');
});