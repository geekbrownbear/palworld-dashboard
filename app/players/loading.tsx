import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"

export default function PlayersLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-800 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-500" />
          <h1 className="text-lg font-semibold text-slate-100">PLAYER MANAGEMENT</h1>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Search Skeleton */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-4">
            <Skeleton className="h-10 w-full bg-slate-800" />
          </CardContent>
        </Card>

        {/* Players List Skeleton */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <Skeleton className="h-6 w-32 bg-slate-800" />
            <Skeleton className="h-4 w-64 bg-slate-800" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-3 rounded-full bg-slate-700" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32 bg-slate-700" />
                      <Skeleton className="h-4 w-48 bg-slate-700" />
                      <Skeleton className="h-3 w-64 bg-slate-700" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 bg-slate-700" />
                    <Skeleton className="h-8 w-16 bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
