import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const PALWORLD_API_URL = process.env.PALWORLD_API_URL || "http://localhost:8212"
const PALWORLD_AUTH_TOKEN = process.env.PALWORLD_AUTH_TOKEN || ""

export async function GET() {
  try {
    const response = await fetch(`${PALWORLD_API_URL}/v1/api/metrics`, {
      headers: {
        Authorization: `Basic ${PALWORLD_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Store metrics in database for historical tracking
    try {
      await prisma.serverMetrics.create({
        data: {
          serverfps: data.serverfps,
          currentplayernum: data.currentplayernum,
          serverframetime: data.serverframetime,
          maxplayernum: data.maxplayernum,
          uptime: data.uptime,
        },
      })
    } catch (dbError) {
      console.error("Error storing metrics:", dbError)
      // Continue even if DB storage fails
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching server metrics:", error)
    return NextResponse.json({ error: "Failed to fetch server metrics" }, { status: 500 })
  }
}
