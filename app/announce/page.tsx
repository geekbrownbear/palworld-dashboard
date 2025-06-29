"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Megaphone, Send, Clock, AlertTriangle, Info, Zap } from "lucide-react"

const quickMessages = [
  {
    title: "Server Restart",
    message: "Server will restart in 10 minutes for maintenance. Please save your progress!",
    icon: Clock,
    color: "text-yellow-400",
  },
  {
    title: "Emergency Alert",
    message: "URGENT: Server emergency maintenance starting now. All players will be disconnected.",
    icon: AlertTriangle,
    color: "text-red-400",
  },
  {
    title: "General Info",
    message: "Welcome to our PalWorld server! Please follow the rules and have fun!",
    icon: Info,
    color: "text-blue-400",
  },
  {
    title: "Event Announcement",
    message: "Special event starting now! Join the community area for exclusive rewards!",
    icon: Zap,
    color: "text-green-400",
  },
]

export default function AnnouncePage() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const sendAnnouncement = async (announcementMessage: string) => {
    if (!announcementMessage.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to announce",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/palworld/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "announce",
          message: announcementMessage.trim(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Announcement Sent",
          description: "Your message has been broadcast to all players",
        })
        setMessage("")
      } else {
        throw new Error("Failed to send announcement")
      }
    } catch (err) {
      toast({
        title: "Announcement Failed",
        description: "Failed to send announcement. Please try again.",
        variant: "destructive",
      })
      console.error("Error sending announcement:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-orange-500" />
          <h1 className="text-lg font-semibold text-slate-100">SERVER ANNOUNCEMENTS</h1>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Custom Message */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Send className="h-5 w-5 text-orange-500" />
              Custom Announcement
            </CardTitle>
            <CardDescription className="text-slate-400">Send a custom message to all connected players</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your announcement message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] bg-slate-800 border-slate-700 text-slate-100 resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{message.length}/500 characters</span>
              <Button
                onClick={() => sendAnnouncement(message)}
                disabled={loading || !message.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Announcement
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Messages */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Quick Messages
            </CardTitle>
            <CardDescription className="text-slate-400">Pre-written messages for common situations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {quickMessages.map((quickMsg, index) => (
                <div key={index} className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <quickMsg.icon className={`h-5 w-5 ${quickMsg.color}`} />
                    <h3 className="font-medium text-slate-200">{quickMsg.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{quickMsg.message}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendAnnouncement(quickMsg.message)}
                    disabled={loading}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Send className="h-3 w-3 mr-2" />
                    Send This Message
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Announcement Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                <p>Announcements are sent to all currently connected players</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                <p>Messages are limited to 500 characters for optimal readability</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                <p>Use clear, concise language for important server notifications</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                <p>Consider using quick messages for common scenarios to save time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
