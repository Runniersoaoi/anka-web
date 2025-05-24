import StatusHeader from "@/components/StatusHeader"
import Navigation from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { VolumeIcon as VolumeUp, Bluetooth, AlertCircle, Settings, BarChart2 } from "lucide-react"
import { useState } from "react"

const guideContent = [
  {
    id: "conectar",
    title: "Conectar el Bastón",
    icon: Bluetooth,
    content:
      "Para conectar el bastón, asegúrate de que el Bluetooth esté activado en tu teléfono. Enciende el bastón manteniendo presionado el botón durante 3 segundos hasta que la luz parpadee. En la aplicación, ve a la pantalla principal y presiona el botón 'Conectar'. Cuando la conexión sea exitosa, verás 'Conectado' en la pantalla y el bastón vibrará brevemente.",
  },
  {
    id: "alertas",
    title: "Interpretar Alertas",
    icon: AlertCircle,
    content:
      "El bastón enviará diferentes tipos de alertas: Obstáculo (para objetos en el camino), Peligro (para desniveles o situaciones peligrosas) y Conexión (para cambios en el estado de conexión). Cada alerta tiene un patrón de vibración distinto y un sonido específico. Las alertas también se muestran en la pantalla de la aplicación y se pueden revisar en la sección 'Alertas'.",
  },
  {
    id: "configuracion",
    title: "Ajustar la Configuración",
    icon: Settings,
    content:
      "En la sección 'Configuración' puedes ajustar la sensibilidad de detección del bastón (Baja, Media o Alta) y el tipo de retroalimentación que prefieres recibir (Vibración, Sonido o Ambos). Elige la configuración que mejor se adapte a tus necesidades y guarda los cambios. La configuración se sincronizará automáticamente con el bastón cuando esté conectado.",
  },
  {
    id: "estadisticas",
    title: "Revisar Estadísticas",
    icon: BarChart2,
    content:
      "La sección 'Estadísticas' te muestra información útil sobre el uso del bastón: el tiempo total de uso, el número de alertas recibidas y la distribución de alertas por día. Puedes utilizar esta información para entender mejor tus patrones de movilidad y las situaciones que encuentras más frecuentemente.",
  },
]


const Guide = () => {
  const [currentSection, setCurrentSection] = useState(null)

  // Función para leer en voz alta una sección o toda la guía
  const leerGuia = (contenido) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel() // Detener lectura previa si existe

      const utterance = new SpeechSynthesisUtterance(contenido)
      utterance.lang = "es-ES"
      utterance.rate = 0.9 // Un poco más lento para mayor claridad
      window.speechSynthesis.speak(utterance)
    }
  }

  // Leer toda la guía
  const leerGuiaCompleta = () => {
    const textoCompleto = guideContent.map((section) => `${section.title}. ${section.content}`).join(". ")

    leerGuia(textoCompleto)
  }

  return (
    <main className="pb-24">
      <StatusHeader />

      <div className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">❓ Guía de Uso</h1>

        <Button
          onClick={leerGuiaCompleta}
          className="w-full mb-6 big-button high-contrast"
          aria-label="Leer guía completa en voz alta"
        >
          <VolumeUp className="mr-2 h-6 w-6" />🔊 Reproducir Guía Completa
        </Button>

        <Card>
          <CardContent className="p-4">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={currentSection}
              onValueChange={setCurrentSection}
            >
              {guideContent.map((section) => (
                <AccordionItem key={section.id} value={section.id} className="border-b last:border-b-0">
                  <AccordionTrigger className="py-4 text-lg hover:no-underline hover:bg-accent">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5" />
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 px-1">
                    <p className="text-base leading-relaxed">{section.content}</p>
                    <Button
                      variant="outline"
                      onClick={() => leerGuia(section.content)}
                      className="mt-4"
                      aria-label={`Leer sección ${section.title} en voz alta`}
                    >
                      <VolumeUp className="mr-2 h-4 w-4" />
                      Leer esta sección
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </main>
  )
}

export default Guide
