
# 🐼 Palworld Server Dashboard

A self-hosted React + Express web app to **monitor and control a Palworld dedicated server** using its REST API.

---

## ⚙️ Overview

This dashboard allows you to:

- View real-time server metrics (FPS, uptime, players, in-game days)
- Broadcast in-game announcements
- View connected players and their details
- Inspect full server settings
- Interact with the Palworld REST API via Swagger UI

---

## 🧱 Project Structure

```
/client/             → React frontend app (includes Swagger UI)
/server/server.js           → Express backend proxy to avoid CORS issues
/client/public/docs/openapi-schema.json → OpenAPI schema powering Swagger UI
docker-compose.yml  → Used by Portainer to deploy the full stack
stack.env                 → Stores runtime config (injected into containers)
```

---

## 🐳 Deployment (via Portainer)

1. **Clone or pull this repo into Portainer**
2. Ensure `stack.env` is set with:
   ```
   PALWORLD_API=http://<server-ip>:8212/v1/api
   PALWORLD_AUTH=Basic <base64-user-pass>
   ```
   You can generate the `PALWORLD_AUTH` with:
   ```bash
   echo -n 'admin:YourPassword' | base64
   ```
3. **Deploy using Portainer**
4. Access the dashboard at `http://<dashboard-ip>:8090`

---

## 🌐 API Proxy Setup

The frontend **never talks to the Palworld API directly** (due to CORS and security). Instead:

- All requests go to `/api/...`
- The backend (Express) relays them to the actual Palworld API using `PALWORLD_API` and `PALWORLD_AUTH`

This keeps your actual game server IP hidden from browsers.

---

## 🧪 Swagger UI

Accessible from the dashboard under **API Explorer**, this allows direct interaction with all documented endpoints using your current authentication.

Swagger UI loads the schema from:
```
/client/public/docs/openapi-schema.json
```
and proxies all API calls through the backend.

---

## 📈 Metrics

The dashboard collects and displays:
- **Real-time server FPS**
- **Player count**
- **Uptime** (formatted as dd:hh:mm:ss)
- **In-game days**
- **5-minute rolling average** for FPS and player count
- **Historical line graph** over time

---

## 🧪 Troubleshooting

### ❌ Swagger UI doesn't load
- Make sure `/docs/openapi-schema.json` exists in `/client/public`
- Confirm the schema has this in the top block:
  ```json
  "servers": [{ "url": "/api" }]
  ```

### ❌ CORS errors / API not working
- The backend must be used as a proxy. Never talk to the game API directly from browser.
- Confirm the Express container is reachable at port 3001 internally.

### ❌ Announcement works but shows error
- This is expected unless the backend parses the response. Message still appears in-game.

---

## 📦 Development Notes

- React is compiled and served via Nginx from `/client`
- Backend uses CommonJS (`require`) and `node-fetch@2`
- Swagger UI is embedded using `swagger-ui-react` and proxied via requestInterceptor
- Containers are set to auto-restart and expose port 8090 externally

---

## 🧠 Recommended Enhancements

- Add authentication to the dashboard UI
- Log historical metrics to persistent storage
- Add CRUD operations for players (e.g. kick/ban)
- Export data as CSV/JSON
- Style customization and dark mode

