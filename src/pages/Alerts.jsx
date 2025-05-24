import StatusHeader from "@/components/StatusHeader"
import Navigation from "@/components/Navigation"
import AlertItem from "@/components/AlertItem"
import { useStatus } from "@/context/statusContext"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp } from "lucide-react"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const Alerts = () => {
  const { alerts } = useStatus()
  const [filtro, setFiltro] = useState("todos")

  // Filtrar alertas según el tipo seleccionado
  const alertasFiltradas =
    filtro === "todos" ? alerts : alerts.filter((alert) => alert.type.toLowerCase() === filtro.toLowerCase())

  // Función para leer en voz alta
  const leerAlerta = (mensaje) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(mensaje)
      utterance.lang = "es-ES"
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <main className="pb-24">
      <StatusHeader />

      <div className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">📥 Alertas</h1>

        {/* Botón para leer última alerta */}
        {alerts.length > 0 && (
          <Button
            onClick={() => leerAlerta(alerts[0].message)}
            className="w-full mb-6 big-button high-contrast"
            aria-label="Leer última alerta en voz alta"
          >
            <VolumeUp className="mr-2 h-6 w-6" />🔊 Leer Última Alerta
          </Button>
        )}

        {/* Filtro de alertas */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Filtrar por tipo:</h2>
          <RadioGroup value={filtro} onValueChange={setFiltro} className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="todos" id="todos" aria-label="Mostrar todas las alertas" />
              <Label htmlFor="todos" className="text-base">
                Todas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="obstáculo" id="obstaculo" aria-label="Filtrar alertas de obstáculos" />
              <Label htmlFor="obstaculo" className="text-base">
                Obstáculos
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="peligro" id="peligro" aria-label="Filtrar alertas de peligro" />
              <Label htmlFor="peligro" className="text-base">
                Peligros
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="conexión" id="conexion" aria-label="Filtrar alertas de conexión" />
              <Label htmlFor="conexion" className="text-base">
                Conexión
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Lista de alertas */}
        <section aria-label="Listado de alertas" className="space-y-4">
          {alertasFiltradas.length > 0 ? (
            alertasFiltradas.map((alerta) => (
              <AlertItem key={alerta.id} type={alerta.type} message={alerta.message} timestamp={alerta.timestamp} />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No hay alertas que mostrar</p>
            </div>
          )}
        </section>
      </div>

      <Navigation />
    </main>
  )
}

export default Alerts
