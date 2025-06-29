import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const PALWORLD_API_URL = process.env.PALWORLD_API_URL || "http://localhost:8212"
const PALWORLD_AUTH_TOKEN = process.env.PALWORLD_AUTH_TOKEN || ""

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...payload } = body

    let endpoint = ""
    const eventType = action

    switch (action) {
      case "announce":
        endpoint = "/v1/api/announce"
        break
      case "kick":
        endpoint = "/v1/api/kick"
        break
      case "ban":
        endpoint = "/v1/api/ban"
        break
      case "unban":
        endpoint = "/v1/api/unban"
        break
      case "save":
        endpoint = "/v1/api/save"
        break
      case "shutdown":
        endpoint = "/v1/api/shutdown"
        break
      case "stop":
        endpoint = "/v1/api/stop"
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const response = await fetch(`${PALWORLD_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${PALWORLD_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Log the event
    try {
      await prisma.serverEvent.create({
        data: {
          type: eventType,
          playerId: payload.userId || null,
          message: payload.message || null,
          adminUser: "dashboard",
        },
      })
    } catch (dbError) {
      console.error("Error logging event:", dbError)
      // Continue even if logging fails
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error performing action:", error)
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 })
  }
}
