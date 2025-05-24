import { Battery, Bluetooth, BluetoothOff } from "lucide-react"
import { useStatus } from "@/context/statusContext"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const StatusHeader = () => {
  const { connected, toggleConnection } = useStatus()

  return (
    <header className="sticky top-0 w-full bg-background border-b z-10 p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={toggleConnection}
          className={cn("flex items-center gap-2 text-lg font-medium", connected ? "text-green-600" : "text-red-600")}
          aria-label={connected ? "Desconectar bastón" : "Conectar bastón"}
        >
          {connected ? <Bluetooth size={24} /> : <BluetoothOff size={24} />}
          <span>{connected ? "Conectado" : "Desconectado"}</span>
        </Button>

        {/* <div className="flex items-center gap-2" aria-label={`Batería al ${batteryLevel}%`}>
          <Battery size={24} className={batteryLevel < 20 ? "text-red-500" : ""} />
          <div className="w-20">
            <Progress
              value={batteryLevel}
              className={cn("h-4", batteryLevel < 20 ? "bg-red-200" : "bg-gray-200")}
              aria-hidden="true"
            />
          </div>
          <span className="font-medium">{batteryLevel}%</span>
        </div> */}
      </div>
    </header>
  )
}

export default StatusHeader
