import "./components/nav-bar.js";
import "./components/loading-state.js";
import "./components/error-state.js";
import "./components/art-card.js";

import { Router } from "./core/Router.js";
import { metApi } from "./api.js";
import { HomeView } from "./views/home.js";
import { ExploreView } from "./views/explore.js";

// Configura las rutas del router
const router = new Router(document.getElementById("app"), [
  { pattern: "/", handler: () => new HomeView({ api: metApi, router }) },
  {
    pattern: "/explore",
    handler: () => new ExploreView({ api: metApi, router }),
  },
]);

// Inicia el router (debe iniciar después de configurar las rutas)
router.start();
