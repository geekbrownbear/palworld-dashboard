import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PalWorld Command Center",
  description: "Tactical server management dashboard for PalWorld",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex min-h-screen bg-slate-950">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  )
}
