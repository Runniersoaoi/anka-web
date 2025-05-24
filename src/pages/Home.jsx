import { useEffect } from "react";
import StatusHeader from "@/components/StatusHeader";
import Navigation from "@/components/Navigation";
import AlertItem from "@/components/AlertItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Settings, BarChart2, HelpCircle } from "lucide-react";
import { useStatus } from "@/context/statusContext";
import { useNavigate } from "react-router-dom";
import ImageDescriptionButton from "@/components/ImageDescriptionButton";

const Home = () => {
  const { alerts, connected, addAlert } = useStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected && alerts.length === 0) {
      const demoAlerts = [
        { message: "Obstáculo detectado a 1 metro", type: "Obstáculo" },
        { message: "Desnivel en el camino", type: "Peligro" },
      ];

      const timeout = setTimeout(() => {
        demoAlerts.forEach((alert, index) => {
          setTimeout(() => {
            addAlert(alert.message, alert.type);
          }, index * 5000);
        });
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [connected, alerts.length, addAlert]);

  const speakAlert = (message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "es-ES";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <main className="pb-24">
      
      <StatusHeader />

      <div className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Bastón Inteligente</h1>

        {/* Última alerta */}
        <section aria-labelledby="ultima-alerta-titulo" className="mb-8">
          <h2 id="ultima-alerta-titulo" className="text-2xl font-semibold mb-4">
            Última Alerta
          </h2>
          {alerts.length > 0 ? (
            <div>
              <AlertItem
                type={alerts[0].type}
                message={alerts[0].message}
                timestamp={alerts[0].timestamp}
                isLatest={true}
              />
              <Button
                onClick={() => speakAlert(alerts[0].message)}
                className="w-full mt-2 big-button high-contrast"
                aria-label="Leer última alerta en voz alta"
              >
                🔊 Leer Alerta
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <p className="text-center text-muted-foreground">
                  No hay alertas recientes
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Menú de navegación principal */}
        <section aria-labelledby="menu-principal-titulo" className="grid gap-4">
          <h2
            id="menu-principal-titulo"
            className="text-2xl font-semibold mb-2"
          >
            Menú Principal
          </h2>

          <Button
            onClick={() => navigate("/alerts")}
            className="big-button"
            variant="outline"
          >
            <Bell className="mr-4 h-6 w-6" />
            📥 Alertas
          </Button>

          <Button
            onClick={() => navigate("/configuration")}
            className="big-button"
            variant="outline"
          >
            <Settings className="mr-4 h-6 w-6" />
            ⚙️ Configuración
          </Button>

          <Button
            onClick={() => navigate("/statistics")}
            className="big-button"
            variant="outline"
          >
            <BarChart2 className="mr-4 h-6 w-6" />
            📊 Estadísticas
          </Button>

          <Button
            onClick={() => navigate("/guide")}
            className="big-button"
            variant="outline"
          >
            <HelpCircle className="mr-4 h-6 w-6" />❓ Guía de Uso
          </Button>
        </section>
      </div>

      <Navigation />
    </main>
  );
};

export default Home;
