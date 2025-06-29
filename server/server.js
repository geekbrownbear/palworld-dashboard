app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3001;
const API_BASE = process.env.PALWORLD_API; // expected to be http://<ip>:8212/v1/api
const AUTH = process.env.PALWORLD_AUTH;

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
  try {
    const r = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    console.error(`[POST ${path}] Error:`, err);
    res.status(500).json({ error: err.message });
  }
};

app.get('/api/info', proxyGet('/info'));
app.get('/api/metrics', proxyGet('/metrics'));
app.get('/api/players', proxyGet('/players'));
app.post('/api/announce', proxyPost('/announce'));

app.listen(PORT, () => console.log(`Palworld proxy backend running on port ${PORT}`));
