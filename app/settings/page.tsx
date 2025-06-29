"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Settings, Gamepad2, Users, Shield, Heart, Sword, Home, Globe } from "lucide-react"

interface ServerSettings {
  // Game Settings
  Difficulty: string
  DayTimeSpeedRate: number
  NightTimeSpeedRate: number
  ExpRate: number
  PalCaptureRate: number
  PalSpawnNumRate: number

  // Combat Settings
  PalDamageRateAttack: number
  PalDamageRateDefense: number
  PlayerDamageRateAttack: number
  PlayerDamageRateDefense: number

  // Player Settings
  PlayerStomachDecreaceRate: number
  PlayerStaminaDecreaceRate: number
  PlayerAutoHPRegeneRate: number
  PlayerAutoHpRegeneRateInSleep: number

  // Pal Settings
  PalStomachDecreaceRate: number
  PalStaminaDecreaceRate: number
  PalAutoHPRegeneRate: number
  PalAutoHpRegeneRateInSleep: number

  // World Settings
  BuildObjectDamageRate: number
  BuildObjectDeteriorationDamageRate: number
  CollectionDropRate: number
  CollectionObjectHpRate: number
  CollectionObjectRespawnSpeedRate: number
  EnemyDropItemRate: number
  WorkSpeedRate: number

  // Server Settings
  DeathPenalty: string
  bEnablePlayerToPlayerDamage: boolean
  bEnableFriendlyFire: boolean
  bEnableInvaderEnemy: boolean
  bActiveUNKO: boolean
  bEnableAimAssistPad: boolean
  bEnableAimAssistKeyboard: boolean

  // Limits
  DropItemMaxNum: number
  DropItemMaxNum_UNKO: number
  BaseCampMaxNum: number
  BaseCampWorkerMaxNum: number
  DropItemAliveMaxHours: number
  GuildPlayerMaxNum: number
  PalEggDefaultHatchingTime: number
  CoopPlayerMaxNum: number
  ServerPlayerMaxNum: number

  // Guild Settings
  bAutoResetGuildNoOnlinePlayers: boolean
  AutoResetGuildTimeNoOnlinePlayers: number

  // Multiplayer Settings
  bIsMultiplay: boolean
  bIsPvP: boolean
  bCanPickupOtherGuildDeathPenaltyDrop: boolean
  bEnableNonLoginPenalty: boolean
  bEnableFastTravel: boolean
  bIsStartLocationSelectByMap: boolean
  bExistPlayerAfterLogout: boolean
  bEnableDefenseOtherGuildPlayer: boolean

  // Server Info
  ServerName: string
  ServerDescription: string
  PublicPort: number
  PublicIP: string
  Region: string
  bUseAuth: boolean
  BanListURL: string
  RESTAPIEnabled: boolean
  RESTAPIPort: number
  RCONEnabled: boolean
  RCONPort: number
  bShowPlayerList: boolean
  AllowConnectPlatform: string
  bIsUseBackupSaveData: boolean
  LogFormatType: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<ServerSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/palworld/settings")
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
          setError(null)
        } else {
          throw new Error("Failed to fetch settings")
        }
      } catch (err) {
        setError("Failed to fetch server settings")
        console.error("Error fetching settings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const formatRate = (rate: number) => {
    return `${(rate * 100).toFixed(0)}%`
  }

  const formatTime = (hours: number) => {
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d ${hours % 24}h`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading server settings...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-400">Failed to load server settings</p>
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
          <Settings className="h-5 w-5 text-orange-500" />
          <h1 className="text-lg font-semibold text-slate-100">SERVER CONFIGURATION</h1>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="border-orange-500/50 text-orange-400">
            Read Only
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

        {/* Game Settings */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-orange-500" />
              Game Settings
            </CardTitle>
            <CardDescription className="text-slate-400">
              Core gameplay configuration and difficulty settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-300">Difficulty</label>
                <p className="text-lg text-slate-100 font-mono">{settings.Difficulty}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Experience Rate</label>
                <p className="text-lg text-slate-100 font-mono">{formatRate(settings.ExpRate)}</p>
                <Progress value={settings.ExpRate * 100} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Pal Capture Rate</label>
                <p className="text-lg text-slate-100 font-mono">{formatRate(settings.PalCaptureRate)}</p>
                <Progress value={settings.PalCaptureRate * 100} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Day Speed</label>
                <p className="text-lg text-slate-100 font-mono">{settings.DayTimeSpeedRate}x</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Night Speed</label>
                <p className="text-lg text-slate-100 font-mono">{settings.NightTimeSpeedRate}x</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Pal Spawn Rate</label>
                <p className="text-lg text-slate-100 font-mono">{formatRate(settings.PalSpawnNumRate)}</p>
                <Progress value={settings.PalSpawnNumRate * 100} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Combat Settings */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Sword className="h-5 w-5 text-orange-500" />
              Combat Settings
            </CardTitle>
            <CardDescription className="text-slate-400">Damage rates and combat balance configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Player Combat
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-400">Attack Damage</label>
                    <p className="text-slate-100 font-mono">{formatRate(settings.PlayerDamageRateAttack)}</p>
                    <Progress value={settings.PlayerDamageRateAttack * 100} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Defense</label>
                    <p className="text-slate-100 font-mono">{formatRate(settings.PlayerDamageRateDefense)}</p>
                    <Progress value={settings.PlayerDamageRateDefense * 100} className="mt-1" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Pal Combat
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-400">Attack Damage</label>
                    <p className="text-slate-100 font-mono">{formatRate(settings.PalDamageRateAttack)}</p>
                    <Progress value={settings.PalDamageRateAttack * 100} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Defense</label>
                    <p className="text-slate-100 font-mono">{formatRate(settings.PalDamageRateDefense)}</p>
                    <Progress value={settings.PalDamageRateDefense * 100} className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Settings */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              Player Settings
            </CardTitle>
            <CardDescription className="text-slate-400">Player survival and regeneration settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Hunger Rate</label>
                <p className="text-lg text-slate-100 font-mono">{formatRate(settings.PlayerStomachDecreaceRate)}</p>
                <Progress value={settings.PlayerStomachDecreaceRate * 100} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Stamina Drain</label>
                <p className="text-lg text-slate-100 font-mono">{formatRate(settings.PlayerStaminaDecreaceRate)}</p>
                <Progress value={settings.PlayerStaminaDecreaceRate * 100} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">HP Regen</label>
                <p className="text-lg text-slate-100 font-mono">{formatRate(settings.PlayerAutoHPRegeneRate)}</p>
                <Progress value={settings.PlayerAutoHPRegeneRate * 100} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Sleep Regen</label>
                <p className="text-lg text-slate-100 font-mono">{formatRate(settings.PlayerAutoHpRegeneRateInSleep)}</p>
                <Progress value={settings.PlayerAutoHpRegeneRateInSleep * 100} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Server Features */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              Server Features
            </CardTitle>
            <CardDescription className="text-slate-400">Multiplayer and PvP configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Multiplayer</span>
                <Switch checked={settings.bIsMultiplay} disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">PvP Enabled</span>
                <Switch checked={settings.bIsPvP} disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Friendly Fire</span>
                <Switch checked={settings.bEnableFriendlyFire} disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Invader Enemies</span>
                <Switch checked={settings.bEnableInvaderEnemy} disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Fast Travel</span>
                <Switch checked={settings.bEnableFastTravel} disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Authentication</span>
                <Switch checked={settings.bUseAuth} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Server Limits */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Home className="h-5 w-5 text-orange-500" />
              Server Limits
            </CardTitle>
            <CardDescription className="text-slate-400">Player and base limitations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Max Players</label>
                <p className="text-lg text-slate-100 font-mono">{settings.ServerPlayerMaxNum}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Coop Players</label>
                <p className="text-lg text-slate-100 font-mono">{settings.CoopPlayerMaxNum}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Guild Size</label>
                <p className="text-lg text-slate-100 font-mono">{settings.GuildPlayerMaxNum}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Base Camps</label>
                <p className="text-lg text-slate-100 font-mono">{settings.BaseCampMaxNum}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Camp Workers</label>
                <p className="text-lg text-slate-100 font-mono">{settings.BaseCampWorkerMaxNum}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Drop Items</label>
                <p className="text-lg text-slate-100 font-mono">{settings.DropItemMaxNum}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Item Lifetime</label>
                <p className="text-lg text-slate-100 font-mono">{formatTime(settings.DropItemAliveMaxHours)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Egg Hatch Time</label>
                <p className="text-lg text-slate-100 font-mono">{formatTime(settings.PalEggDefaultHatchingTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Settings */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-500" />
              Network Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">Server network and API settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-slate-300">Public IP</label>
                <p className="text-lg text-slate-100 font-mono">{settings.PublicIP || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Public Port</label>
                <p className="text-lg text-slate-100 font-mono">{settings.PublicPort}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Region</label>
                <p className="text-lg text-slate-100 font-mono">{settings.Region || "Unknown"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">REST API Port</label>
                <p className="text-lg text-slate-100 font-mono">{settings.RESTAPIPort}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">RCON Port</label>
                <p className="text-lg text-slate-100 font-mono">{settings.RCONPort}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Platform</label>
                <p className="text-lg text-slate-100 font-mono">{settings.AllowConnectPlatform || "All"}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">REST API</span>
                <Switch checked={settings.RESTAPIEnabled} disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">RCON</span>
                <Switch checked={settings.RCONEnabled} disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Show Player List</span>
                <Switch checked={settings.bShowPlayerList} disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
