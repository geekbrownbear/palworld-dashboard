const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3001;
const API_BASE = process.env.PALWORLD_API;
const AUTH = process.env.PALWORLD_AUTH;

app.use(bodyParser.json());

app.use('/api/:endpoint', async (req, res) => {
  try {
    const url = `${API_BASE}/${req.params.endpoint}`;
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'application/json'
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(`[Proxy Error] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Palworld proxy backend listening on port ${PORT}`));
