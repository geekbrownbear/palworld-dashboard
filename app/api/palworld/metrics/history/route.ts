import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = Number.parseInt(searchParams.get("hours") || "24")

    const since = new Date(Date.now() - hours * 60 * 60 * 1000)

    const metrics = await prisma.serverMetrics.findMany({
      where: {
        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching metrics history:", error)
    return NextResponse.json({ error: "Failed to fetch metrics history" }, { status: 500 })
  }
}
