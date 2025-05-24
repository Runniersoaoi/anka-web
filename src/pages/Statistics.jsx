import StatusHeader from "@/components/StatusHeader";
import Navigation from "@/components/Navigation";
import { useStatus } from "@/context/statusContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VolumeIcon as VolumeUp, Clock, Bell, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

const Statistics = () => {
  const { alerts, usageTime } = useStatus();
  const [alertsByDay, setAlertsByDay] = useState({});

  // Agrupar alertas por día
  useEffect(() => {
    const groupedAlerts = {};

    alerts.forEach((alert) => {
      const date = new Date(alert.timestamp).toLocaleDateString("es-ES");
      if (groupedAlerts[date]) {
        groupedAlerts[date]++;
      } else {
        groupedAlerts[date] = 1;
      }
    });

    setAlertsByDay(groupedAlerts);
  }, [alerts]);

  // Calcular máximo para la escala visual
  const maxAlerts = Math.max(...Object.values(alertsByDay), 1);

  // Formatear horas y minutos
  const formatTimeUsage = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} minutos`;
    } else if (mins === 0) {
      return `${hours} horas`;
    } else {
      return `${hours} horas y ${mins} minutos`;
    }
  };

  // Leer estadísticas en voz alta
  const leerEstadisticas = () => {
    if ("speechSynthesis" in window) {
      const totalAlertas = alerts.length;
      const tiempoUso = formatTimeUsage(usageTime);

      const mensaje = `Has recibido un total de ${totalAlertas} alertas. Tu tiempo de uso del bastón es de ${tiempoUso}.`;

      const utterance = new SpeechSynthesisUtterance(mensaje);
      utterance.lang = "es-ES";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <main className="pb-24">
      <StatusHeader />

      <div className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">📊 Estadísticas</h1>

        <Button
          onClick={leerEstadisticas}
          className="w-full mb-6 big-button high-contrast"
          aria-label="Leer estadísticas en voz alta"
        >
          <VolumeUp className="mr-2 h-6 w-6" />
          📢 Leer Estadísticas
        </Button>

        <div className="space-y-6">
          {/* Tiempo de uso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Tiempo de Uso
              </CardTitle>
              <CardDescription>Tiempo total de uso del bastón</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center py-4">
                {formatTimeUsage(usageTime)}
              </p>
            </CardContent>
          </Card>

          {/* Total de alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Total de Alertas
              </CardTitle>
              <CardDescription>
                Número total de alertas recibidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center py-4">
                {alerts.length}
              </p>
            </CardContent>
          </Card>

          {/* Alertas por día */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Alertas por Día
              </CardTitle>
              <CardDescription>
                Distribución de alertas recibidas por día
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(alertsByDay).length > 0 ? (
                Object.entries(alertsByDay).map(([date, count]) => (
                  <div
                    key={date}
                    className="grid grid-cols-[1fr_2fr] gap-2 items-center"
                  >
                    <div className="font-medium">{date}:</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="bg-primary h-6 rounded-full"
                        style={{ width: `${(count / maxAlerts) * 100}%` }}
                        aria-hidden="true"
                      />
                      <span>{count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No hay datos suficientes
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Navigation />
    </main>
  );
};

export default Statistics;
