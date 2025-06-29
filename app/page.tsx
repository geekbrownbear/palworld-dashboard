"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Activity, Users, Server, Clock, Zap, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface ServerInfo {
  version: string
  servername: string
  description: string
}

interface ServerMetrics {
  serverfps: number
  currentplayernum: number
  serverframetime: number
  maxplayernum: number
  uptime: number
}

interface PlayersData {
  players: Array<{
    name: string
    playerId: string
    userId: string
    ip: string
    ping: number
    location_x: number
    location_y: number
    level: number
  }>
}

export default function Dashboard() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [metrics, setMetrics] = useState<ServerMetrics | null>(null)
  const [players, setPlayers] = useState<PlayersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [infoRes, metricsRes, playersRes] = await Promise.all([
        fetch("/api/palworld/info"),
        fetch("/api/palworld/metrics"),
        fetch("/api/palworld/players"),
      ])

      if (infoRes.ok) {
        const infoData = await infoRes.json()
        setServerInfo(infoData)
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      }

      if (playersRes.ok) {
        const playersData = await playersRes.json()
        setPlayers(playersData)
      }

      setError(null)
    } catch (err) {
      setError("Failed to fetch server data")
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const getServerStatus = () => {
    if (!metrics) return { status: "unknown", color: "gray" }

    if (metrics.serverfps < 20) return { status: "critical", color: "red" }
    if (metrics.serverfps < 40) return { status: "warning", color: "yellow" }
    return { status: "operational", color: "green" }
  }

  const serverStatus = getServerStatus()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Establishing connection to command center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
          <h1 className="text-lg font-semibold text-slate-100">TACTICAL COMMAND CENTER</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={serverStatus.color === "green" ? "default" : "destructive"}>
            {serverStatus.status.toUpperCase()}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {error && (
          <Card className="border-red-500/50 bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Server Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Server Status</CardTitle>
              {serverStatus.color === "green" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : serverStatus.color === "yellow" ? (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{serverInfo?.servername || "Unknown"}</div>
              <p className="text-xs text-slate-400">Version {serverInfo?.version || "N/A"}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active Players</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{metrics?.currentplayernum || 0}</div>
              <p className="text-xs text-slate-400">of {metrics?.maxplayernum || 0} max</p>
              {metrics && <Progress value={(metrics.currentplayernum / metrics.maxplayernum) * 100} className="mt-2" />}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Server FPS</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{metrics?.serverfps || 0}</div>
              <p className="text-xs text-slate-400">{metrics?.serverframetime?.toFixed(2) || 0}ms frame time</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">
                {metrics ? formatUptime(metrics.uptime) : "0d 0h 0m"}
              </div>
              <p className="text-xs text-slate-400">Continuous operation</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">Emergency server management controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 bg-transparent"
                onClick={() => (window.location.href = "/announce")}
              >
                <Zap className="mr-2 h-4 w-4" />
                Send Announcement
              </Button>
              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                onClick={() => (window.location.href = "/players")}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Players
              </Button>
              <Button
                variant="outline"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 bg-transparent"
                onClick={async () => {
                  try {
                    await fetch("/api/palworld/actions", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "save" }),
                    })
                  } catch (err) {
                    console.error("Save failed:", err)
                  }
                }}
              >
                <Server className="mr-2 h-4 w-4" />
                Save World
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Players */}
        {players && players.players.length > 0 && (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-200">Active Players</CardTitle>
              <CardDescription className="text-slate-400">Currently connected players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players.players.slice(0, 5).map((player) => (
                  <div key={player.playerId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{player.name}</p>
                        <p className="text-xs text-slate-400">Level {player.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300">{player.ping.toFixed(0)}ms</p>
                      <p className="text-xs text-slate-400">{player.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
