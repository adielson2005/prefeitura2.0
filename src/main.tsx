import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { dataService } from "./lib/dataService";
import { initializeDatabase } from "./lib/db";

// Inicializar dados
dataService.init();
initializeDatabase().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
