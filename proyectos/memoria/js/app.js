import { Home } from "./pages/Home.js";
import { Router } from "./core/Router.js";

const appContainer = document.getElementById("app");

// Definición de las rutas de la aplicación
const routes = {
  "/": () => new Home(),
  // Ejemplo: "/juego": () => new GamePage(),
};

// Inicializamos el enrutador y lo exportamos por si otras páginas necesitan navegar
export const router = new Router(appContainer, routes);
