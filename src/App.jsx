import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Configuration from "./pages/Configuration";
import Alerts from "./pages/Alerts";
import Statistics from "./pages/Statistics";
import { StatusProvider } from "./context/statusContext";
import Guide from "./pages/Guide";
import ImageDescriptionButton from "./components/ImageDescriptionButton";

function App() {
  return (
    <StatusProvider>
      <BrowserRouter>
        <ImageDescriptionButton />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </StatusProvider>
  );
}

export default App;
