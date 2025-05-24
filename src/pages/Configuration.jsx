import StatusHeader from "@/components/StatusHeader"
import Navigation from "@/components/Navigation"
import { useStatus } from "@/context/statusContext"
import { Button } from "@/components/ui/button"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sliders, Volume2, Vibrate, Save } from "lucide-react"
import { useState } from "react"
// import { useToast } from "@/hooks/use-toast"
const Configuration = () => {
  const { sensitivity, feedback, setSensitivity, setFeedback } = useStatus()
  const [tempSensitivity, setTempSensitivity] = useState(sensitivity)
  const [tempFeedback, setTempFeedback] = useState(feedback)
  // const { toast } = useToast()

  const guardarConfiguracion = () => {
    setSensitivity(tempSensitivity)
    setFeedback(tempFeedback)

    // Mostrar toast de confirmación
    // toast({
    //   title: "Configuración guardada",
    //   description: "Tus preferencias han sido actualizadas correctamente.",
    // })

    // Proporcionar retroalimentación por voz
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("Configuración guardada correctamente")
      utterance.lang = "es-ES"
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <main className="pb-24">
      <StatusHeader />

      <div className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">⚙️ Configuración</h1>

        <div className="space-y-8">
          {/* Sensibilidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-6 w-6" />
                Sensibilidad de Detección
              </CardTitle>
              <CardDescription>Configura la sensibilidad del bastón para detectar obstáculos</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={tempSensitivity}
                onValueChange={(v) => setTempSensitivity(v)}
                className="grid gap-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem value="Baja" id="baja" className="h-5 w-5" aria-label="Sensibilidad baja" />
                  <Label htmlFor="baja" className="text-lg">
                    Baja
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem value="Media" id="media" className="h-5 w-5" aria-label="Sensibilidad media" />
                  <Label htmlFor="media" className="text-lg">
                    Media
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem value="Alta" id="alta" className="h-5 w-5" aria-label="Sensibilidad alta" />
                  <Label htmlFor="alta" className="text-lg">
                    Alta
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Tipo de retroalimentación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-6 w-6" />
                Tipo de Retroalimentación
              </CardTitle>
              <CardDescription>Elige cómo quieres recibir las alertas del bastón</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={tempFeedback}
                onValueChange={(v) => setTempFeedback(v)}
                className="grid gap-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem
                    value="Vibración"
                    id="vibracion"
                    className="h-5 w-5"
                    aria-label="Retroalimentación por vibración"
                  />
                  <Label htmlFor="vibracion" className="text-lg">
                    <Vibrate className="h-5 w-5 inline mr-2" />
                    Vibración
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem
                    value="Sonido"
                    id="sonido"
                    className="h-5 w-5"
                    aria-label="Retroalimentación por sonido"
                  />
                  <Label htmlFor="sonido" className="text-lg">
                    <Volume2 className="h-5 w-5 inline mr-2" />
                    Sonido
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem
                    value="Ambos"
                    id="ambos"
                    className="h-5 w-5"
                    aria-label="Retroalimentación por vibración y sonido"
                  />
                  <Label htmlFor="ambos" className="text-lg">
                    <Volume2 className="h-5 w-5 inline mr-2" />
                    <Vibrate className="h-5 w-5 inline mr-2" />
                    Ambos
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Botón de guardar */}
          <Button
            onClick={guardarConfiguracion}
            className="w-full big-button high-contrast"
            aria-label="Guardar configuración"
          >
            <Save className="mr-2 h-6 w-6" />💾 Guardar Configuración
          </Button>
        </div>
      </div>

      <Navigation />
    </main>
  )
}

export default Configuration
