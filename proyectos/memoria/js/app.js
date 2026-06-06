import { HomeView } from "./views/HomeView.js";
import { GameView } from "./views/GameView.js";
import { Router } from "./core/Router.js";
import { audioController } from "./core/audioController.js";

const appContainer = document.getElementById("app");

// Definición de las rutas de la aplicación
const routes = {
  "/": () => new HomeView(),
  "/game": () => new GameView(),
};

// Inicializamos el enrutador y lo exportamos por si otras páginas necesitan navegar
export const router = new Router(appContainer, routes);

// Inicializamos el controlador de audio global
audioController.init();
