/*V-05 — Jugadores (`#players`)

**Propósito:** Gestionar los jugadores de todos los equipos de la liga activa.

#### 4.5.1 Sección: Filtros y búsqueda

- Campo de búsqueda por nombre con **debounce** (300–500 ms).
- Filtro por equipo (selector).
- Filtro por posición (selector con las posiciones registradas en la liga).
- Botón "Limpiar filtros".

#### 4.5.2 Listado

- Galería de tarjetas con foto, nombre, equipo (con escudo pequeño), número y posición.
- Al hacer clic, navega a `#player/:id`.

#### 4.5.3 Crear / Editar Jugador

Formulario con:

- **Nombre** (obligatorio).
- **Foto** (opcional, URL).
- **Posición** (texto libre — la pareja decide si maneja un catálogo o lo deja abierto).
- **Número** (numérico, único dentro del equipo).
- **Equipo** (selector obligatorio de los equipos de la liga activa).

#### 4.5.4 Eliminar Jugador

- Si el jugador tiene eventos registrados en partidos, se debe **bloquear la eliminación** y mostrar un mensaje explicativo.
- Si no tiene eventos, se elimina con confirmación.
*/

import db from "../db.js";
import "../components/player-form.js";
import "../components/player-card.js";
import { showToast } from "../components/toast.js";

export class PlayersView {
  constructor({ router }) {
    this.router = router;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <div class="page-header">
        <h1>Jugadores</h1>
        <button class="btn btn-primary" id="create-player">+ Nuevo Jugador</button>
      </div>
      <loading-state message="Cargando jugadores..."></loading-state>
    `;
    container.querySelector("#create-player").addEventListener("click", () => {
      const form = document.createElement("player-form");
      form.addEventListener("player-created", () => this.render());
      this.container.appendChild(form);
    });
    this.render();
  }

  async render() {
    const leagueId = db.getActiveLeagueId();

    if (!leagueId) {
      this.container.innerHTML = `<div class="empty-state"><p>No hay una liga activa.</p></div>`;
      return;
    }

    const teams = await db.getByIndex("teams", "leagueId", Number(leagueId));
    const teamMap = {};
    teams.forEach((t) => {
      teamMap[t.id] = t;
    });

    const allPlayers = [];
    for (const team of teams) {
      const players = await db.getByIndex("players", "teamId", team.id);
      allPlayers.push(...players.map((p) => ({ ...p, teamId: team.id })));
    }

    const loader = this.container.querySelector("loading-state");
    if (loader) loader.remove();

    this.container.querySelectorAll("#player-list, #player-empty").forEach((el) => el.remove());

    if (allPlayers.length === 0) {
      const msg = document.createElement("div");
      msg.id = "player-empty";
      msg.className = "empty-state";
      msg.innerHTML = "<p>No hay jugadores en esta liga.</p>";
      this.container.appendChild(msg);
      return;
    }

    const allEvents = await db.getAll("events");
    const playerHasEvents = {};
    allEvents.forEach((e) => {
      playerHasEvents[e.playerId] = true;
    });

    let list = this.container.querySelector("#player-list");
    if (!list) {
      list = document.createElement("div");
      list.id = "player-list";
    } else {
      list.innerHTML = "";
    }
    list.className = "card-grid";

    for (const p of allPlayers) {
      const team = teamMap[p.teamId] || {};
      const card = document.createElement("player-card");
      card.data = {
        ...p,
        teamName: team.name,
        teamEscudo: team.escudo,
        teamColor: team.colorPrincipal,
        teamColorSecundario: team.colorSecundario,
      };
      card.addEventListener("click", () => this.router.navigateTo(`/player/${p.id}`));
      list.appendChild(card);

      const actions = document.createElement("div");
      actions.style.cssText = "display:flex;gap:0.25rem;margin-top:0.5rem;justify-content:center";

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm btn-secondary";
      editBtn.textContent = "Editar";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const form = document.createElement("player-form");
        form.setAttribute("edit-id", p.id);
        form.addEventListener("player-updated", () => this.render());
        this.container.appendChild(form);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-danger";
      deleteBtn.textContent = "Eliminar";
      deleteBtn.addEventListener("click", (e) => this.#deletePlayer(e, p.id, playerHasEvents));

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      card.appendChild(actions);
    }

    this.container.appendChild(list);
  }

  async #deletePlayer(e, playerId, playerHasEvents) {
    e.stopPropagation();

    if (playerHasEvents[playerId]) {
      showToast(
        "No se puede eliminar un jugador que tiene eventos registrados en partidos",
        "error",
      );
      return;
    }

    const { ConfirmDialog } = await import("../components/confirm-dialog.js");
    const confirmed = await ConfirmDialog.show(
      "Eliminar jugador",
      "¿Estás seguro de eliminar este jugador?",
    );
    if (!confirmed) return;

    await db.remove("players", playerId);
    showToast("Jugador eliminado", "success");
    this.render();
  }

  unmount() {
    this.container = null;
  }
}
