import React, { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

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
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [health, setHealth] = useState("unknown");
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [averages, setAverages] = useState({ fps: null, players: null });

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d.toString().padStart(2, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateAverages = (data) => {
    if (data.length === 0) return;
    const totalFPS = data.reduce((acc, cur) => acc + cur.fps, 0);
    const totalPlayers = data.reduce((acc, cur) => acc + cur.players, 0);
    setAverages({
      fps: (totalFPS / data.length).toFixed(1),
      players: (totalPlayers / data.length).toFixed(1)
    });
  };

  const fetchData = async () => {
    try {
      const [infoRes, metricsRes, playersRes, healthRes] = await Promise.all([
        fetch(`${API_BASE}/info`),
        fetch(`${API_BASE}/metrics`),
        fetch(`${API_BASE}/players`),
        fetch(`${API_BASE}/health`)
      ]);

      const infoData = await infoRes.json();
      const metricsData = await metricsRes.json();
      const playersData = await playersRes.json();
      const healthData = await healthRes.json();

      setInfo(infoData);
      setMetrics(metricsData);
      setPlayers(Array.isArray(playersData) ? playersData : playersData.players || []);
      setHealth(healthData?.status || "unhealthy");
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);

      const updatedHistory = [...metricsHistory.slice(-49), {
        time: new Date().toLocaleTimeString(),
        fps: metricsData.serverfps,
        players: metricsData.currentplayernum,
        uptime: metricsData.uptime
      }];
      setMetricsHistory(updatedHistory);
      calculateAverages(updatedHistory);
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
		let errText;
		try {
			errText = await res.text();
		} catch {
			errText = `HTTP ${res.status}`;
		}
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
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchData, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="text-sm text-gray-600">
          <span>Last Updated: {lastUpdated || "never"}</span>
          <span className={`ml-4 px-2 py-1 rounded text-white text-xs ${health === 'ok' ? 'bg-green-600' : 'bg-red-600'}`}>
            API Status: {health}
          </span>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData}>🔄 Manual Refresh</Button>
          <label className="text-sm flex items-center gap-1">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
            />
            Auto-refresh
          </label>
        </div>
      </div>

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
                <li><strong>Server FPS:</strong> <span className={metrics.serverfps < 30 ? "text-red-600" : "text-green-700"}>{metrics.serverfps}</span> (avg: {averages.fps})</li>
                <li><strong>Players:</strong> {metrics.currentplayernum}/{metrics.maxplayernum} (avg: {averages.players})</li>
                <li><strong>Uptime:</strong> {formatUptime(metrics.uptime)} (DD:HH:MM:SS)</li>
                <li><strong>Frame Time:</strong> <span className={metrics.serverframetime > 25 ? "text-yellow-600" : "text-black"}>{metrics.serverframetime.toFixed(2)}ms</span></li>
                <li><strong>In-game Days:</strong> {metrics.days}</li>
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
				  <li key={p.userId || idx} className="border p-2 rounded bg-gray-50">
					<div className="font-semibold text-lg">{p.name} {p.level ? `(Level ${p.level})` : null}</div>
					<div className="text-sm text-gray-700">Account: {p.accountName}</div>
					/*<div className="text-sm text-gray-700">User ID: {p.userId} | Player ID: {p.playerId}</div>*/
					<div className="text-sm text-gray-700">IP: {p.ip} | Ping: {p.ping.toFixed(2)}ms</div>
					<div className="text-sm text-gray-700">Location: ({p.location_x}, {p.location_y})</div>
					<div className="text-sm text-gray-700">Buildings Owned: {p.building_count}</div>
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
          <h2 className="text-xl font-bold mb-4">Performance History</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" interval={4} />
              <YAxis domain={[0, 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="fps" stroke="#1d4ed8" name="FPS" />
              <Line type="monotone" dataKey="players" stroke="#059669" name="Players" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
