import "./components/nav-bar.js";
import "./components/loading-state.js";
import "./components/error-state.js";
import "./components/art-card.js";
import "./components/dept-card.js"

import { Router } from "./core/Router.js";
import { metApi } from "./api.js";
import { HomeView } from "./views/home.js";
import { ExploreView } from "./views/explore.js";
import { DetailView } from "./views/detail.js";
import { DepartmentsView } from "./views/departments.js";
import { ByArtistView } from "./views/by-artist.js";
import { CompareView } from "./views/compare.js";

// Configura las rutas del router
const router = new Router(document.getElementById("app"), [
  { pattern: "/", handler: () => new HomeView({ api: metApi, router }) },
  {
    pattern: "/explore",
    handler: () => new ExploreView({ api: metApi, router }),
  },
  {
    pattern: "/departments",
    handler: () => new DepartmentsView({ api: metApi, router }),
  },
  {
    pattern: "/detail/:id",
    handler: (p) => new DetailView({ api: metApi, router, id: p.id }),
  },
  {
    pattern: "/explore/:deptId",
    handler: (params) => {
      const view = new ExploreView({ api: metApi, router });
      view.filters.departmentId = params.deptId;
      return view;
    },
  },
  {
    pattern: "/artist/:name",
    handler: (params) => new ByArtistView({ 
      api: metApi, 
      router, 
      name: params.name 
    }),
  },
  {
    pattern: "/compare",
    handler: (params) => new CompareView({
      api: metApi,
      router,
      preselectId: params.preselect || null,
    }),
  }
]);

// Inicia el router (debe iniciar después de configurar las rutas)
router.start();
