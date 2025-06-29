const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
console.log('[DEBUG] PALWORLD_API:', process.env.PALWORLD_API);
console.log('[DEBUG] PALWORLD_AUTH:', process.env.PALWORLD_AUTH);

const app = express();
const PORT = 3001;
const API_BASE = process.env.PALWORLD_API; // expected to be http://<ip>:8212/v1/api
const AUTH = process.env.PALWORLD_AUTH;

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use(bodyParser.json());

const proxyGet = (path) => async (req, res) => {
  try {
    const r = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Authorization': AUTH,
        'Accept': 'application/json'
      }
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    console.error(`[GET ${path}] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};

const proxyPost = (path) => async (req, res) => {
  const url = `${API_BASE}${path}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : { status: "ok" };
    } catch {
      data = { status: "ok" };
    }

    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

app.get('/info', proxyGet('/info'));
app.get('/metrics', proxyGet('/metrics'));
app.get('/players', proxyGet('/players'));
app.post('/announce', proxyPost('/announce'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`Palworld proxy backend running on port ${PORT}`));
