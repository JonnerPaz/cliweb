import "./components/nav-bar.js";
import "./components/loading-state.js";
import "./components/error-state.js";
import "./components/art-card.js";

import { Router } from "./core/Router.js";
import { metApi } from "./api.js";
import { HomeView } from "./views/home.js";
import { ExploreView } from "./views/explore.js";

const router = new Router(document.getElementById("app"), [
  { pattern: "/", handler: () => new HomeView({ api: metApi, router }) },
  {
    pattern: "/explore",
    handler: () => new ExploreView({ api: metApi, router }),
  },
]);
