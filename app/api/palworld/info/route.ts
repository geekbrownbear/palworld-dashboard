import { NextResponse } from "next/server"

const PALWORLD_API_URL = process.env.PALWORLD_API_URL || "http://localhost:8212"
const PALWORLD_AUTH_TOKEN = process.env.PALWORLD_AUTH_TOKEN || ""

export async function GET() {
  try {
    const response = await fetch(`${PALWORLD_API_URL}/v1/api/info`, {
      headers: {
        Authorization: `Basic ${PALWORLD_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching server info:", error)
    return NextResponse.json({ error: "Failed to fetch server info" }, { status: 500 })
  }
}
