import { HomeView } from "./views/HomeView.js";
import { GameView } from "./views/GameView.js";
import { ResultsView } from "./views/ResultsView.js";
import { Router } from "./core/Router.js";
import { audioController } from "./core/audioController.js";
import { createMusicToggle } from "./components/musicToggle.js";

const appContainer = document.getElementById("app");

const routes = {
  "/": () => new HomeView(),
  "/game": () => new GameView(),
  "/results": () => new ResultsView(),
};

// Inicializamos el enrutador y lo exportamos por si otras páginas necesitan navegar
export const router = new Router(appContainer, routes);

// Inicializamos el controlador de audio global
audioController.init();

// Botón flotante de música visible en toda la aplicación
document.body.appendChild(createMusicToggle().element);
