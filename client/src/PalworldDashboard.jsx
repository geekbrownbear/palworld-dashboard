
import React, { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const Card = ({ children, className = "" }) => (
  <div className={`border rounded shadow p-4 bg-white ${className}`}>{children}</div>
);
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, ...props }) => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded" {...props}>{children}</button>
);
const Input = (props) => <input className="border p-2 rounded w-full" {...props} />;

const API_BASE = "/api"; // Updated for proxy

export default function PalworldDashboard() {
  const [info, setInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    const [infoRes, metricsRes, playersRes] = await Promise.all([
      fetch(`${API_BASE}/info`),
      fetch(`${API_BASE}/metrics`),
      fetch(`${API_BASE}/players`)
    ]);
    setInfo(await infoRes.json());
    setMetrics(await metricsRes.json());
    const pData = await playersRes.json();
    setPlayers(pData.players);
  };

  const announce = async () => {
    await fetch(`${API_BASE}/announce`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });
    setMessage("");
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Server Info</h2>
            {info && (
              <ul>
                <li><strong>Name:</strong> {info.servername}</li>
                <li><strong>Version:</strong> {info.version}</li>
                <li><strong>Description:</strong> {info.description}</li>
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Metrics</h2>
            {metrics && (
              <ul>
                <li><strong>FPS:</strong> {metrics.serverfps}</li>
                <li><strong>Players:</strong> {metrics.currentplayernum}/{metrics.maxplayernum}</li>
                <li><strong>Uptime:</strong> {metrics.uptime}s</li>
                <li><strong>Frame Time:</strong> {metrics.serverframetime}ms</li>
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Players</h2>
            <ul className="space-y-1">
              {players.map((p) => (
                <li key={p.userId} className="border p-2 rounded">
                  <strong>{p.name}</strong> (Level {p.level}) - {p.ip} - {p.ping}ms
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardContent className="flex gap-2 items-end">
            <Input
              placeholder="Announce message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={announce}>Send Announcement</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">API Explorer (Swagger UI)</h2>
          <div className="border rounded overflow-hidden">
            <SwaggerUI url="/docs/openapi-schema.json" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
