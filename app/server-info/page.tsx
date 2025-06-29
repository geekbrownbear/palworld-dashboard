"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Server, Globe, Shield, Users } from "lucide-react"

interface ServerInfo {
  version: string
  servername: string
  description: string
}

interface ServerSettings {
  ServerName: string
  ServerDescription: string
  PublicPort: number
  PublicIP: string
  ServerPlayerMaxNum: number
  CoopPlayerMaxNum: number
  Region: string
  bIsMultiplay: boolean
  bIsPvP: boolean
  bUseAuth: boolean
  RESTAPIEnabled: boolean
  RESTAPIPort: number
  RCONEnabled: boolean
  RCONPort: number
  bShowPlayerList: boolean
  AllowConnectPlatform: string
  LogFormatType: string
}

export default function ServerInfoPage() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [settings, setSettings] = useState<ServerSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, settingsRes] = await Promise.all([fetch("/api/palworld/info"), fetch("/api/palworld/settings")])

        if (infoRes.ok) {
          const infoData = await infoRes.json()
          setServerInfo(infoData)
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setSettings(settingsData)
        }

        setError(null)
      } catch (err) {
        setError("Failed to fetch server information")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading server information...</p>
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
          <Server className="h-5 w-5 text-orange-500" />
          <h1 className="text-lg font-semibold text-slate-100">SERVER INFORMATION</h1>
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

        {/* Basic Server Info */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-500" />
              Server Details
            </CardTitle>
            <CardDescription className="text-slate-400">
              Basic server identification and version information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-300">Server Name</label>
                <p className="text-lg text-slate-100 font-mono">
                  {serverInfo?.servername || settings?.ServerName || "Unknown"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Version</label>
                <p className="text-lg text-slate-100 font-mono">{serverInfo?.version || "Unknown"}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Description</label>
              <p className="text-slate-100">
                {serverInfo?.description || settings?.ServerDescription || "No description available"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Network Configuration */}
        {settings && (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-500" />
                Network Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">Server network and connectivity settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-slate-300">Public IP</label>
                  <p className="text-lg text-slate-100 font-mono">{settings.PublicIP || "Not configured"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Public Port</label>
                  <p className="text-lg text-slate-100 font-mono">{settings.PublicPort}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Region</label>
                  <p className="text-lg text-slate-100 font-mono">{settings.Region || "Unknown"}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">REST API Port</label>
                  <p className="text-lg text-slate-100 font-mono">{settings.RESTAPIPort}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">RCON Port</label>
                  <p className="text-lg text-slate-100 font-mono">{settings.RCONPort}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Server Capabilities */}
        {settings && (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Player Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">Player limits and multiplayer settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-300">Max Players</label>
                  <p className="text-lg text-slate-100 font-mono">{settings.ServerPlayerMaxNum}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Coop Max Players</label>
                  <p className="text-lg text-slate-100 font-mono">{settings.CoopPlayerMaxNum}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Allowed Platforms</label>
                <p className="text-lg text-slate-100 font-mono">{settings.AllowConnectPlatform || "All"}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Server Features */}
        {settings && (
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                Server Features
              </CardTitle>
              <CardDescription className="text-slate-400">Enabled features and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Multiplayer</span>
                  <Badge variant={settings.bIsMultiplay ? "default" : "secondary"}>
                    {settings.bIsMultiplay ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">PvP</span>
                  <Badge variant={settings.bIsPvP ? "destructive" : "secondary"}>
                    {settings.bIsPvP ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Authentication</span>
                  <Badge variant={settings.bUseAuth ? "default" : "secondary"}>
                    {settings.bUseAuth ? "Required" : "Optional"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">REST API</span>
                  <Badge variant={settings.RESTAPIEnabled ? "default" : "secondary"}>
                    {settings.RESTAPIEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">RCON</span>
                  <Badge variant={settings.RCONEnabled ? "default" : "secondary"}>
                    {settings.RCONEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Player List</span>
                  <Badge variant={settings.bShowPlayerList ? "default" : "secondary"}>
                    {settings.bShowPlayerList ? "Public" : "Hidden"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
