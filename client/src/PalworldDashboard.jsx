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

const API_BASE = "/api";

export default function PalworldDashboard() {
  const [info, setInfo] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [infoRes, metricsRes, playersRes] = await Promise.all([
        fetch(`${API_BASE}/info`),
        fetch(`${API_BASE}/metrics`),
        fetch(`${API_BASE}/players`)
      ]);

      const infoData = await infoRes.json();
      const metricsData = await metricsRes.json();
      const playersData = await playersRes.json();

      console.log("Info:", infoData);
      console.log("Metrics:", metricsData);
      console.log("Players:", playersData);

      setInfo(infoData);
      setMetrics(metricsData);
      setPlayers(Array.isArray(playersData) ? playersData : playersData.players || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Unable to fetch one or more data sources.");
    }
  };

  const announce = async () => {
    try {
      const res = await fetch(`${API_BASE}/announce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Announce failed:", errText);
        setError("Announcement failed: " + errText);
      } else {
        console.log("Announcement sent successfully.");
        setMessage("");
        setError(null);
      }
    } catch (err) {
      console.error("Announce error:", err);
      setError("Announcement error: " + err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 p-4">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded border border-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Server Info</h2>
            {info ? (
              <ul>
                <li><strong>Name:</strong> {info.servername}</li>
                <li><strong>Version:</strong> {info.version}</li>
                <li><strong>Description:</strong> {info.description}</li>
              </ul>
            ) : (
              <p className="text-gray-500">No server info available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Metrics</h2>
            {metrics ? (
              <ul>
                <li><strong>FPS:</strong> {metrics.serverfps}</li>
                <li><strong>Players:</strong> {metrics.currentplayernum}/{metrics.maxplayernum}</li>
                <li><strong>Uptime:</strong> {metrics.uptime}s</li>
                <li><strong>Frame Time:</strong> {metrics.serverframetime}ms</li>
              </ul>
            ) : (
              <p className="text-gray-500">No metrics available.</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Players</h2>
            {players.length > 0 ? (
              <ul className="space-y-1">
                {players.map((p, idx) => (
                  <li key={p.userId || idx} className="border p-2 rounded">
                    <strong>{p.name}</strong> {p.level ? `(Level ${p.level})` : null} - {p.ip} - {p.ping}ms
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No players online or data not available.</p>
            )}
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
