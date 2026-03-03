const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ── Simple file-based DB ──────────────
const DB_FILE = '/tmp/db.json';

function readDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch(e) {}
  return {
    users: [],
    businesses: [],
    reviews: [
      { id:1, offerId:1, user:"Sara M.", stars:5, text:"Amazing deal! Saved so much.", date:"2 days ago" },
      { id:2, offerId:1, user:"James K.", stars:4, text:"Great app, very convenient!", date:"3 days ago" }
    ],
    offers: [
      { id:1, name:"Summer Blowout Sale", business:"Zara", category:"retail", discount:"30%", description:"Off all summer collection", distance:"180m", hours:"Open now", timer:"2h 14m", views:1200, active:true },
      { id:2, name:"Free Drink on Any Meal", business:"Burger Lab", category:"food", discount:"Free", description:"Any soft drink with order", distance:"320m", hours:"11am-11pm", timer:"45m", views:847, active:true },
      { id:3, name:"Ladies Night 2-for-1", business:"Skybar Lounge", category:"event", discount:"2for1", description:"All cocktails tonight only", distance:"600m", hours:"8pm-2am", timer:"4h 30m", views:3400, active:true },
      { id:4, name:"Haircut + Style Deal", business:"Studio One", category:"service", discount:"40%", description:"Full cut and blowdry", distance:"410m", hours:"9am-9pm", timer:"1h 52m", views:522, active:true },
      { id:5, name:"End of Season Clearance", business:"H&M", category:"retail", discount:"50%", description:"Selected items only", distance:"250m", hours:"Open now", timer:"3h 10m", views:2100, active:true }
    ]
  };
}

function writeDB(data) {
  try { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); } catch(e) {}
}

// ── ROUTES ────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: '✅ Dealspot backend is running!', time: new Date() });
});

app.get('/offers', (req, res) => {
  const db = readDB();
  const { category } = req.query;
  let offers = db.offers.filter(o => o.active);
  if (category && category !== 'all') offers = offers.filter(o => o.category === category);
  res.json(offers);
});

app.get('/offers/:id', (req, res) => {
  const db = readDB();
  const offer = db.offers.find(o => o.id === parseInt(req.params.id));
  if (!offer) return res.status(404).json({ error: 'Not found' });
  res.json(offer);
});

app.post('/offers', (req, res) => {
  const db = readDB();
  const offer = { id: Date.now(), ...req.body, views: 0, active: true, createdAt: new Date().toISOString() };
  db.offers.push(offer);
  writeDB(db);
  res.json({ success: true, offer });
});

app.put('/offers/:id', (req, res) => {
  const db = readDB();
  const idx = db.offers.findIndex(o => o.id === parseInt(req.params.id));
  if (idx > -1) { db.offers[idx] = { ...db.offers[idx], ...req.body }; writeDB(db); }
  res.json({ success: true });
});

app.delete('/offers/:id', (req, res) => {
  const db = readDB();
  db.offers = db.offers.filter(o => o.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ success: true });
});

app.get('/businesses', (req, res) => {
  res.json(readDB().businesses);
});

app.post('/businesses', (req, res) => {
  const db = readDB();
  const biz = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  db.businesses.push(biz);
  writeDB(db);
  res.json({ success: true, business: biz });
});

app.get('/reviews/:offerId', (req, res) => {
  const db = readDB();
  res.json(db.reviews.filter(r => r.offerId === parseInt(req.params.offerId)));
});

app.post('/reviews', (req, res) => {
  const db = readDB();
  const review = { id: Date.now(), ...req.body, date: 'Just now' };
  db.reviews.push(review);
  writeDB(db);
  res.json({ success: true, review });
});

app.post('/users', (req, res) => {
  const db = readDB();
  const existing = db.users.find(u => u.email === req.body.email);
  if (existing) return res.json({ success: true, user: existing });
  const user = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  db.users.push(user);
  writeDB(db);
  res.json({ success: true, user });
});

// ── START ─────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dealspot running on port ${PORT}`);
});