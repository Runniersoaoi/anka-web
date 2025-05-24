import { createContext, useContext, useState, useEffect } from "react";

// type Alert = {
//   id: string
//   message: string
//   type: string
//   timestamp: Date
// }

// type StatusContextType = {
//   connected
//   batteryLevel
//   alerts
//   sensitivity
//   feedback
//   toggleConnection
//   addAlert
//   setSensitivity
//   setFeedback
//   usageTime
//   incrementUsageTime
// }

const StatusContext = createContext(undefined);

export function StatusProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(80);
  const [alerts, setAlerts] = useState([]);
  const [sensitivity, setSensitivityState] = useState("Media"); // por ejemplo
  const [feedback, setFeedbackState] = useState("Vibración");
  const [usageTime, setUsageTime] = useState(0);

  // Cargar configuraciones guardadas
  useEffect(() => {
    const savedSensitivity = localStorage.getItem("sensitivity");
    const savedFeedback = localStorage.getItem("feedback");

    if (savedSensitivity) {
      setSensitivityState(savedSensitivity);
    }
    if (savedFeedback) {
      setFeedbackState(savedFeedback);
    }

    // Cargar alertas guardadas
    const savedAlerts = localStorage.getItem("alerts");
    if (savedAlerts) {
      try {
        const parsedAlerts = JSON.parse(savedAlerts);
        // Convertir strings de fecha a objetos Date
        parsedAlerts.forEach((alert) => {
          alert.timestamp = new Date(alert.timestamp);
        });
        setAlerts(parsedAlerts);
      } catch (e) {
        console.error("Error parsing saved alerts", e);
      }
    }
  }, []);

  // Guardar configuraciones cuando cambien
  useEffect(() => {
    localStorage.setItem("sensitivity", sensitivity);
    localStorage.setItem("feedback", feedback);
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [sensitivity, feedback, alerts]);

  // Simular cambio de batería
  useEffect(() => {
    if (connected) {
      const interval = setInterval(() => {
        setBatteryLevel((prev) => Math.max(prev - 1, 0));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [connected]);

  const toggleConnection = () => {
    setConnected((prev) => !prev);
    if (!connected) {
      addAlert("Bastón conectado correctamente", "conexión");
    } else {
      addAlert("Bastón desconectado", "conexión");
    }
  };

  const addAlert = (message, type) => {
    const newAlert = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // Simular habla de la alerta si está configurado
    if (feedback === "Sonido" || feedback === "Ambos") {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "es-ES";
        window.speechSynthesis.speak(utterance);
      }
    }

    // Simular vibración si está configurada
    if (feedback === "Vibración" || feedback === "Ambos") {
      if ("vibrate" in navigator) {
        navigator.vibrate(500);
      }
    }
  };

  const setSensitivity = (level) => {
    setSensitivityState(level);
  };

  const setFeedback = (type) => {
    setFeedbackState(type);
  };

  const incrementUsageTime = () => {
    setUsageTime((prev) => prev + 1);
  };

  // Incrementar tiempo de uso cuando está conectado
  useEffect(() => {
    let timer;
    if (connected) {
      timer = setInterval(() => {
        incrementUsageTime();
      }, 60000); // Incrementar cada minuto
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [connected]);

  return (
    <StatusContext.Provider
      value={{
        connected,
        batteryLevel,
        alerts,
        sensitivity,
        feedback,
        toggleConnection,
        addAlert,
        setSensitivity,
        setFeedback,
        usageTime,
        incrementUsageTime,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}

export function useStatus() {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error("useStatus must be used within a StatusProvider");
  }
  return context;
}
