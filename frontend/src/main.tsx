import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// main.tsx or App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

createRoot(document.getElementById("root")!).render(<App />);
