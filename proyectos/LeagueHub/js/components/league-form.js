import db from "../db.js";
import { getSportList } from "../sports-terms.js";

class LeagueForm extends HTMLElement {
  connectedCallback() {
    this.buildDOM();
  }

  buildDOM() {
    const sports = getSportList();

    this.innerHTML = `
      <div class="dialog-overlay">
        <div class="league-form-dialog">
          <h3>Nueva Liga</h3>
          <form id="league-form">
            <div class="form-group">
              <label class="form-label" for="league-name">Nombre</label>
              <input class="form-input" id="league-name" name="name" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="league-sport">Deporte</label>
              <select class="form-select" id="league-sport" name="sport" required>
                <option value="">Seleccionar...</option>
                ${sports.map((s) => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join("")}
              </select>
            </div>
            <fieldset class="form-group">
              <legend class="form-label">Modalidad</legend>
              <label class="radio-label"><input type="radio" name="modalidad" value="league" checked /> Liga</label>
              <label class="radio-label"><input type="radio" name="modalidad" value="tournament" /> Eliminación Directa</label>
            </fieldset>
            <div class="form-row">
              <div class="form-group" id="rounds-group">
                <label class="form-label" for="league-rounds">Vueltas</label>
                <input class="form-input" id="league-rounds" name="rounds" type="number" min="1" value="1" />
              </div>
              <div class="form-group">
                <label class="form-label" for="league-season">Temporada</label>
                <input class="form-input" id="league-season" name="temporada" placeholder="2026" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="league-desc">Descripción</label>
              <textarea class="form-textarea" id="league-desc" name="description" rows="3"></textarea>
            </div>
            <div class="dialog-actions">
              <button type="button" class="btn btn-secondary" id="form-cancel">Cancelar</button>
              <button type="submit" class="btn btn-primary">Crear</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.querySelectorAll('input[name="modalidad"]').forEach((r) => {
      r.addEventListener("change", () => this.#toggleRoundsField());
    });
    this.#toggleRoundsField();

    this.querySelector("#form-cancel").addEventListener("click", () => this.close());
    this.querySelector("#league-form").addEventListener("submit", (e) => this.#handleSubmit(e));
    this.querySelector(".dialog-overlay").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) this.close();
    });
  }

  #toggleRoundsField() {
    const isLeague = this.querySelector('input[name="modalidad"]:checked').value === "league";
    this.querySelector("#rounds-group").style.display = isLeague ? "block" : "none";
  }

  async #handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      sport: form.sport.value,
      modalidad: form.modalidad.value,
      temporada: form.temporada.value.trim() || new Date().getFullYear().toString(),
      description: form.description.value.trim(),
      isActive: false,
      createdAt: Date.now(),
    };

    if (data.modalidad === "league") {
      data.rounds = Number(form.rounds.value) || 1;
    }

    if (!data.name || !data.sport) return;

    try {
      const id = await db.add("leagues", data);
      data.id = id;
      this.dispatchEvent(new CustomEvent("league-created", { detail: { league: data } }));
      this.close();
    } catch (err) {
      console.error("Error al crear la liga:", err);
    }
  }

  close() {
    this.remove();
  }
}

customElements.define("league-form", LeagueForm);
