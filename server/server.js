import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;
const API_BASE = process.env.PALWORLD_API;
const AUTH = process.env.PALWORLD_AUTH;

console.log('[DEBUG] PALWORLD_API:', API_BASE);
console.log('[DEBUG] PALWORLD_AUTH:', AUTH);

app.use(bodyParser.json());

app.use('/api/*', async (req, res) => {
  const endpointPath = req.originalUrl.replace('/api/', '');
  const url = `${API_BASE}/${endpointPath}`;

  const headers = {
    Authorization: AUTH
  };
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    headers['Content-Type'] = 'application/json';
  }

  console.log(`[Proxy] ${req.method} → ${url}`);

  try {
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: ['POST', 'PUT', 'PATCH'].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined
    });

    const contentType = response.headers.get('content-type');
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    console.log(`[Proxy] ← ${response.status} ${url}`);

    res.status(response.status).send(responseData);
  } catch (err) {
    console.error(`[Proxy Error] ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Palworld proxy backend running on port ${PORT}`);
});
