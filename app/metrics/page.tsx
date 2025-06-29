"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Activity, Users, Zap, Clock, TrendingUp, RefreshCw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface ServerMetrics {
  serverfps: number
  currentplayernum: number
  serverframetime: number
  maxplayernum: number
  uptime: number
}

interface HistoricalMetrics {
  id: number
  serverfps: number
  currentplayernum: number
  serverframetime: number
  maxplayernum: number
  uptime: number
  timestamp: string
}

export default function MetricsPage() {
  const [currentMetrics, setCurrentMetrics] = useState<ServerMetrics | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState(24) // hours

  const fetchCurrentMetrics = async () => {
    try {
      const response = await fetch("/api/palworld/metrics")
      if (response.ok) {
        const data = await response.json()
        setCurrentMetrics(data)
      }
    } catch (err) {
      console.error("Error fetching current metrics:", err)
    }
  }

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`/api/palworld/metrics/history?hours=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setHistoricalData(data)
      }
    } catch (err) {
      console.error("Error fetching historical data:", err)
      setError("Failed to fetch historical metrics")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchCurrentMetrics(), fetchHistoricalData()])
      setLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchCurrentMetrics, 5000) // Update current metrics every 5 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const chartData = historicalData.map((item) => ({
    ...item,
    time: formatTimestamp(item.timestamp),
    timestamp: new Date(item.timestamp).getTime(),
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading performance metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          <h1 className="text-lg font-semibold text-slate-100">PERFORMANCE METRICS</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchCurrentMetrics()
              fetchHistoricalData()
            }}
            className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {error && (
          <Card className="border-red-500/50 bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400">
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[1, 6, 24, 72, 168].map((hours) => (
            <Button
              key={hours}
              variant={timeRange === hours ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(hours)}
              className={timeRange === hours ? "" : "border-slate-600 text-slate-400 hover:bg-slate-800"}
            >
              {hours === 1 ? "1h" : hours === 6 ? "6h" : hours === 24 ? "24h" : hours === 72 ? "3d" : "7d"}
            </Button>
          ))}
        </div>

        {/* Current Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Server FPS</CardTitle>
              <Zap className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{currentMetrics?.serverfps || 0}</div>
              <p className="text-xs text-slate-400">{currentMetrics?.serverframetime?.toFixed(2) || 0}ms frame time</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active Players</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{currentMetrics?.currentplayernum || 0}</div>
              <p className="text-xs text-slate-400">of {currentMetrics?.maxplayernum || 0} max</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Frame Time</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">
                {currentMetrics?.serverframetime?.toFixed(1) || 0}ms
              </div>
              <p className="text-xs text-slate-400">Server processing time</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">
                {currentMetrics ? formatUptime(currentMetrics.uptime) : "0d 0h 0m"}
              </div>
              <p className="text-xs text-slate-400">Continuous operation</p>
            </CardContent>
          </Card>
        </div>

        {/* FPS Chart */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Server Performance
            </CardTitle>
            <CardDescription className="text-slate-400">
              FPS and frame time over the last{" "}
              {timeRange === 1
                ? "hour"
                : timeRange === 6
                  ? "6 hours"
                  : timeRange === 24
                    ? "24 hours"
                    : timeRange === 72
                      ? "3 days"
                      : "7 days"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "6px",
                    }}
                  />
                  <Line type="monotone" dataKey="serverfps" stroke="#f97316" strokeWidth={2} name="FPS" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Player Count Chart */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              Player Activity
            </CardTitle>
            <CardDescription className="text-slate-400">Player count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "6px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="currentplayernum"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Players"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
