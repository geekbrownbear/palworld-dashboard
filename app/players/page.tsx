"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Users, UserX, Shield, ShieldOff, Search, MapPin, Wifi } from "lucide-react"

interface Player {
  name: string
  playerId: string
  userId: string
  ip: string
  ping: number
  location_x: number
  location_y: number
  level: number
}

interface PlayersData {
  players: Player[]
}

export default function PlayersPage() {
  const [playersData, setPlayersData] = useState<PlayersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [actionMessage, setActionMessage] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/palworld/players")
      if (response.ok) {
        const data = await response.json()
        setPlayersData(data)
        setError(null)
      } else {
        throw new Error("Failed to fetch players")
      }
    } catch (err) {
      setError("Failed to fetch players")
      console.error("Error fetching players:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayers()
    const interval = setInterval(fetchPlayers, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const performAction = async (action: string, player: Player, message?: string) => {
    setActionLoading(true)
    try {
      const response = await fetch("/api/palworld/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          userId: player.userId,
          message: message || undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Action Successful",
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} action performed on ${player.name}`,
        })
        setSelectedPlayer(null)
        setActionMessage("")
        // Refresh player list after action
        setTimeout(fetchPlayers, 1000)
      } else {
        throw new Error(`Failed to ${action} player`)
      }
    } catch (err) {
      toast({
        title: "Action Failed",
        description: `Failed to ${action} ${player.name}. Please try again.`,
        variant: "destructive",
      })
      console.error(`Error performing ${action}:`, err)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredPlayers =
    playersData?.players.filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.ip.includes(searchTerm),
    ) || []

  const getPingColor = (ping: number) => {
    if (ping < 50) return "text-green-400"
    if (ping < 100) return "text-yellow-400"
    return "text-red-400"
  }

  const getPingStatus = (ping: number) => {
    if (ping < 50) return "Excellent"
    if (ping < 100) return "Good"
    if (ping < 200) return "Fair"
    return "Poor"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading player data...</p>
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
          <Users className="h-5 w-5 text-orange-500" />
          <h1 className="text-lg font-semibold text-slate-100">PLAYER MANAGEMENT</h1>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="border-orange-500/50 text-orange-400">
            {playersData?.players.length || 0} Active Players
          </Badge>
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

        {/* Search */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search players by name, ID, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Players List */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200">Active Players</CardTitle>
            <CardDescription className="text-slate-400">Currently connected players and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  {playersData?.players.length === 0 ? "No players currently online" : "No players match your search"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.playerId}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                      <div>
                        <h3 className="text-lg font-medium text-slate-100">{player.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Level {player.level}
                          </span>
                          <span className="flex items-center gap-1">
                            <Wifi className={`h-3 w-3 ${getPingColor(player.ping)}`} />
                            {player.ping.toFixed(0)}ms ({getPingStatus(player.ping)})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {player.location_x.toFixed(0)}, {player.location_y.toFixed(0)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          ID: {player.userId} | IP: {player.ip}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPlayer(player)}
                            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Kick
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-slate-100">Kick Player</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Remove {player.name} from the server. They can reconnect immediately.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Optional kick message..."
                              value={actionMessage}
                              onChange={(e) => setActionMessage(e.target.value)}
                              className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedPlayer(null)
                                setActionMessage("")
                              }}
                              disabled={actionLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => selectedPlayer && performAction("kick", selectedPlayer, actionMessage)}
                              disabled={actionLoading}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              {actionLoading ? "Kicking..." : "Kick Player"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPlayer(player)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Ban
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-slate-100">Ban Player</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Permanently ban {player.name} from the server. This action requires manual unbanning.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Ban reason (recommended)..."
                              value={actionMessage}
                              onChange={(e) => setActionMessage(e.target.value)}
                              className="bg-slate-800 border-slate-700 text-slate-100"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedPlayer(null)
                                setActionMessage("")
                              }}
                              disabled={actionLoading}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => selectedPlayer && performAction("ban", selectedPlayer, actionMessage)}
                              disabled={actionLoading}
                              variant="destructive"
                            >
                              {actionLoading ? "Banning..." : "Ban Player"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unban Section */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <ShieldOff className="h-5 w-5 text-green-500" />
              Unban Player
            </CardTitle>
            <CardDescription className="text-slate-400">Remove a player from the ban list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Enter player User ID to unban..."
                value={actionMessage}
                onChange={(e) => setActionMessage(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
              <Button
                onClick={async () => {
                  if (!actionMessage.trim()) return
                  setActionLoading(true)
                  try {
                    const response = await fetch("/api/palworld/actions", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        action: "unban",
                        userId: actionMessage.trim(),
                      }),
                    })

                    if (response.ok) {
                      toast({
                        title: "Player Unbanned",
                        description: `Player with ID ${actionMessage} has been unbanned`,
                      })
                      setActionMessage("")
                    } else {
                      throw new Error("Failed to unban player")
                    }
                  } catch (err) {
                    toast({
                      title: "Unban Failed",
                      description: "Failed to unban player. Please check the User ID and try again.",
                      variant: "destructive",
                    })
                  } finally {
                    setActionLoading(false)
                  }
                }}
                disabled={actionLoading || !actionMessage.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? "Unbanning..." : "Unban Player"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
