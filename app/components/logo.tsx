import { Brain } from "lucide-react"

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Brain className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
        Mind Ease
      </span>
    </div>
  )
}
