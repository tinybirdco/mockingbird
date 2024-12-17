import { GenerateStats } from "@/components/generate/generate-stats"
import { Button } from "@/components/ui/button"

export default function GeneratePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Generate Data</h1>
        <Button>Start Generation</Button>
      </div>
      <GenerateStats />
    </div>
  )
}
