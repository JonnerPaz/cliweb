import db from "../db.js";
import "../components/league-form.js";
import { showToast } from "../components/toast.js";
import { generateRoundRobin, generateBracket } from "../utils/helpers.js";
import { getSportTerms } from "../sports-terms.js";

export class LeaguesView {
  constructor({ router }) {
    this.router = router;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <div class="page-header">
        <h1>Ligas</h1>
        <button class="btn btn-primary" id="create-league">+ Nueva Liga</button>
      </div>
      <loading-state message="Cargando ligas..."></loading-state>
    `;
    container.querySelector("#create-league").addEventListener("click", () => {
      const form = document.createElement("league-form");
      form.addEventListener("league-created", () => this.render());
      this.container.appendChild(form);
    });
    this.render();
  }

  async render() {
    const leagues = await db.getAll("leagues");
    const activeId = db.getActiveLeagueId();

    const allMatches = await db.getAll("matches");
    const hasMatches = {};
    allMatches.forEach((m) => {
      hasMatches[m.leagueId] = true;
    });

    const list = this.container.querySelector("#league-list") || document.createElement("div");
    list.id = "league-list";

    if (leagues.length === 0) {
      list.innerHTML = `<div class="empty-state"><p>No hay ligas creadas aún.</p></div>`;
    } else {
      list.className = "card-grid";
      list.innerHTML = leagues
        .map((l) => {
          const t = getSportTerms(l.sport);
          return `
        <div class="card ${Number(activeId) === l.id ? "active" : ""}" data-id="${l.id}">
          <h3>${t.icon} ${l.name}</h3>
          <p>${t.name} — ${l.temporada || ""}</p>
          <p>${l.modalidad === "league" ? "Liga" : "Eliminación Directa"}</p>
          <div style="margin-top:0.5rem;display:flex;gap:0.25rem;flex-wrap:wrap">
            <button class="btn btn-sm btn-primary js-activate" data-id="${l.id}">Activar</button>
            <button class="btn btn-sm btn-secondary js-edit" data-id="${l.id}">Editar</button>
            ${l.modalidad === "league" && !hasMatches[l.id] ? `<button class="btn btn-sm btn-secondary js-schedule" data-id="${l.id}">Programar partidos</button>` : ""}
            ${l.modalidad === "tournament" && !hasMatches[l.id] ? `<button class="btn btn-sm btn-secondary js-bracket" data-id="${l.id}">Generar bracket</button>` : ""}
            <button class="btn btn-sm btn-danger js-delete" data-id="${l.id}">Eliminar</button>
          </div>
        </div>
      `;
        })
        .join("");

      list.querySelectorAll(".js-activate").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const id = Number(btn.dataset.id);
          await db.runTransaction(["leagues"], "readwrite", (stores) => {
            const all = stores.leagues.getAll();
            all.onsuccess = () => {
              all.result.forEach((l) => {
                stores.leagues.put({ ...l, isActive: l.id === id });
              });
            };
          });
          db.setActiveLeagueId(id);
          this.router.navigateTo("/dashboard");
        });
      });

      list.querySelectorAll(".js-edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const form = document.createElement("league-form");
          form.setAttribute("edit-id", btn.dataset.id);
          form.addEventListener("league-updated", () => this.render());
          this.container.appendChild(form);
        });
      });

      list.querySelectorAll(".js-schedule").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const leagueId = Number(btn.dataset.id);
          btn.disabled = true;

          const existing = await db.getByIndex("matches", "leagueId", leagueId);
          if (existing.length > 0) {
            showToast("Esta liga ya tiene partidos programados", "info");
            btn.disabled = false;
            return;
          }

          const league = await db.getById("leagues", leagueId);
          const teams = await db.getByIndex("teams", "leagueId", leagueId);

          if (teams.length < 2) {
            showToast("Se necesitan al menos 2 equipos", "error");
            btn.disabled = false;
            return;
          }

          const matches = generateRoundRobin(teams, league.rounds || 1);

          await db.runTransaction(["matches"], "readwrite", (stores) => {
            matches.forEach((m) => {
              stores.matches.add({
                leagueId,
                homeTeamId: m.home,
                awayTeamId: m.away,
                round: m.round,
                date: null,
                status: "Programado",
                homeScore: null,
                awayScore: null,
              });
            });
          });

          showToast(`Calendario generado con ${matches.length} partidos`, "success");
          this.render();
        });
      });

      list.querySelectorAll(".js-bracket").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const leagueId = Number(btn.dataset.id);
          btn.disabled = true;

          const existing = await db.getByIndex("matches", "leagueId", leagueId);
          if (existing.length > 0) {
            showToast("Esta liga ya tiene un bracket generado", "info");
            btn.disabled = false;
            return;
          }

          const teams = await db.getByIndex("teams", "leagueId", leagueId);
          if (teams.length < 2) {
            showToast("Se necesitan al menos 2 equipos", "error");
            btn.disabled = false;
            return;
          }

          const matches = generateBracket(teams);

          await db.runTransaction(["matches"], "readwrite", (stores) => {
            matches.forEach((m) => {
              stores.matches.add({
                leagueId,
                round: m.round,
                position: m.position,
                homeTeamId: m.homeTeamId,
                awayTeamId: m.awayTeamId,
                date: null,
                status: "Programado",
                homeScore: null,
                awayScore: null,
              });
            });
          });

          showToast(`Bracket generado con ${matches.length} partidos`, "success");
          this.render();
        });
      });

      list.querySelectorAll(".js-delete").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const { ConfirmDialog } = await import("../components/confirm-dialog.js");
          const confirmed = await ConfirmDialog.show(
            "Eliminar liga",
            "¿Eliminar esta liga y todos sus datos? Se borrarán equipos, jugadores, partidos y eventos asociados.",
          );
          if (confirmed) {
            const id = Number(btn.dataset.id);
            await db.remove("leagues", id);
            this.render();
          }
        });
      });
    }

    const loader = this.container.querySelector("loading-state");
    if (loader) loader.remove();
    this.container.appendChild(list);
  }

  unmount() {
    this.container = null;
  }
}
