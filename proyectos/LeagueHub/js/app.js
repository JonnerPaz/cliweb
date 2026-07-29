import "./components/nav-bar.js";
import "./components/loading-state.js";
import "./components/error-state.js";
import "./components/confirm-dialog.js";

import db from "./db.js";
import { Router } from "./core/Router.js";
import { DashboardView } from "./views/dashboard.js";
import { LeaguesView } from "./views/leagues.js";
import { TeamsView } from "./views/teams.js";
import { StatsView } from "./views/stats.js";
import { PlayersView } from "./views/players.js";
import { MatchesView } from "./views/matches.js";
import { TeamDetailView } from "./views/team-detail.js";
import { PlayerDetailView } from "./views/player-detail.js";
import { MatchDetailView } from "./views/match-detail.js";

async function init() {
  try {
    await db.open();
  } catch (err) {
    console.error("Error al abrir IndexedDB:", err);
  }

  const app = document.getElementById("app");

  const router = new Router(app, [
    { pattern: "/", handler: () => new DashboardView({ router }) },
    { pattern: "/leagues", handler: () => new LeaguesView({ router }) },
    { pattern: "/teams", handler: () => new TeamsView({ router }) },
    { pattern: "/team/:id", handler: (p) => new TeamDetailView({ router, id: p.id }) },
    { pattern: "/players", handler: () => new PlayersView({ router }) },
    { pattern: "/player/:id", handler: (p) => new PlayerDetailView({ router, id: p.id }) },
    { pattern: "/matches", handler: () => new MatchesView({ router }) },
    { pattern: "/match/:id", handler: (p) => new MatchDetailView({ router, id: p.id }) },
    { pattern: "/stats", handler: () => new StatsView({ router }) },
  ]);

  router.start();
}

await init();
