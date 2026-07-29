import "./components/nav-bar.js";
import "./components/footer.js";
import "./components/loading-state.js";
import "./components/error-state.js";
import "./components/confirm-dialog.js";

import { Router } from "./core/Router.js";
import { openDB } from "./db.js";
import { DashboardView } from "./views/dashboard.js";

async function init() {
  try {
    await openDB();
    document.querySelector("app-footer")?.setDbStatus("IndexedDB: Conectado");
  } catch (err) {
    document.querySelector("app-footer")?.setDbStatus("IndexedDB: Error", true);
    console.error("Error al abrir IndexedDB:", err);
  }

  const app = document.getElementById("app");

  const router = new Router(app, [
    { pattern: "/", handler: () => new DashboardView({ router }) },
    { pattern: "/dashboard", handler: () => new DashboardView({ router }) },
  ]);

  router.start();
}

await init();
