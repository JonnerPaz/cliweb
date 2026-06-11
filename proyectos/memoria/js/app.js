import { HomeView } from "./views/HomeView.js";
import { GameView } from "./views/GameView.js";
import { ResultsView } from "./views/ResultsView.js";
import { Router } from "./core/Router.js";
import { createMusicToggle } from "./components/musicToggle.js";

const appContainer = document.getElementById("app");

const routes = {
  "/": () => new HomeView(),
  "/game": () => new GameView(),
  "/results": () => new ResultsView(),
};

export const router = new Router(appContainer, routes);

document.body.appendChild(createMusicToggle().element);
