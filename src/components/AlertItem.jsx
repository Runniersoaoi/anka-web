import { AlertCircle, AlertTriangle, Clock, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const AlertItem = ({ type, message, timestamp, isLatest = false }) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case "obstáculo":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      case "peligro":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      case "conexión":
        return <Info className="h-6 w-6 text-blue-500" />
      default:
        return <Info className="h-6 w-6 text-gray-500" />
    }
  }

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("es", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date)
  }

  return (
    <div
      className={cn("flex items-start p-4 border rounded-lg gap-3", isLatest ? "bg-accent" : "bg-card")}
      tabIndex={0}
    >
      <div className="mt-1">{getIcon()}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-bold">{type}</span>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <time dateTime={timestamp.toISOString()}>{formatTime(timestamp)}</time>
          </div>
        </div>
        <p className={cn("mt-1", isLatest ? "font-medium text-lg" : "text-base")}>{message}</p>
      </div>
    </div>
  )
}

export default AlertItem
