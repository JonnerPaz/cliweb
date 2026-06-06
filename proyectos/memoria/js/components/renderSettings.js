import gameState from "../state/GameState.js";

const POKEMON_TYPES = [
  { value: "random", label: "Aleatoria" },
  { value: "normal", label: "Normal" },
  { value: "fire", label: "Fuego" },
  { value: "water", label: "Agua" },
  { value: "grass", label: "Planta" },
  { value: "electric", label: "Eléctrico" },
  { value: "ice", label: "Hielo" },
  { value: "fighting", label: "Lucha" },
  { value: "poison", label: "Veneno" },
  { value: "ground", label: "Tierra" },
  { value: "flying", label: "Volador" },
  { value: "psychic", label: "Psíquico" },
  { value: "bug", label: "Bicho" },
  { value: "rock", label: "Roca" },
  { value: "ghost", label: "Fantasma" },
  { value: "dragon", label: "Dragón" },
  { value: "dark", label: "Siniestro" },
  { value: "steel", label: "Acero" },
  { value: "fairy", label: "Hada" },
];

function updateVisibility(nameItem, countItem) {
  const mode = gameState.gameMode;
  if (nameItem) nameItem.hidden = mode !== "solo";
  if (countItem) countItem.hidden = mode !== "pvp";
  if (gameState.playerName === "")
    gameState.playerName = "Entrenador sin nombre";
}

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Asignar Eventos
const handleModeChange = (e) => {
  gameState.gameMode = e.target.value;
  updateVisibility();
};

const handleDiffChange = (e) => (gameState.difficulty = e.target.value);
const handleThemeChange = (e) => (gameState.theme = e.target.value);
const handleNameChange = (e) => (gameState.playerName = e.target.value);
const handleCountChange = (e) =>
  (gameState.playerCount = Number(e.target.value));
const handleMusicChange = (e) => {
  const enabled = e.target.checked;
  gameState.musicEnabled = enabled;
  window.dispatchEvent(
    new CustomEvent("music-setting-changed", { detail: { enabled } })
  );
};

const themeOptions = POKEMON_TYPES.map(
  (t) =>
    `<option value="${t.value}"${
      t.value === gameState.theme ? " selected" : ""
    }>${t.label}</option>`
).join("");

export function renderSettings(container) {
  const gameMode = gameState.gameMode ?? "solo";
  const difficulty = gameState.difficulty ?? "Facil";
  const playerCount = gameState.playerCount ?? 2;
  const musicEnabled = Boolean(gameState.musicEnabled);

  container.innerHTML = `
    <section class="settings" aria-label="Configuración de la partida">
      <h2 class="settings__title">
        <span class="settings__title-icon" aria-hidden="true">⚙️</span>
        Settings
      </h2>

      <div class="settings__container">
        <div class="settings__item">
          <label class="settings__item--label" for="settings-mode">
            <span class="settings__item-icon" aria-hidden="true">🎮</span>
            Modo de juego
          </label>
          <select id="settings-mode" class="settings__select">
            <option value="solo"${gameMode === "solo" ? " selected" : ""}>Solitario</option>
            <option value="pvp"${gameMode === "pvp" ? " selected" : ""}>PvP</option>
            <option value="free"${gameMode === "free" ? " selected" : ""}>Libre</option>
          </select>
        </div>

        <div class="settings__item">
          <label class="settings__item--label" for="settings-difficulty">
            <span class="settings__item-icon">🏆</span>
            Dificultad
          </label>
          <select id="settings-difficulty" class="settings__select">
            <option value="Facil"${difficulty === "Facil" ? " selected" : ""}>Fácil (4×4)</option>
            <option value="Medio"${difficulty === "Medio" ? " selected" : ""}>Medio (6×6)</option>
            <option value="Dificil"${difficulty === "Dificil" ? " selected" : ""}>Difícil (8×8)</option>
          </select>
        </div>

        <div class="settings__item">
          <label class="settings__item--label" for="settings-theme">
            <span class="settings__item-icon" aria-hidden="true">🎨</span>
            Temática
          </label>
          <select id="settings-theme" class="settings__select">
            ${themeOptions}
          </select>
        </div>

        <div class="settings__item" id="settings-player-name-item" >
          <label class="settings__item--label" for="settings-player-name">
            <span class="settings__item-icon">👤</span>
            Tu nombre
          </label>
          <input
            type="text"
            id="settings-player-name"
            class="settings__input"
            maxlength="20"
            placeholder="Entrenador"
            value=""
          />
        </div>

        <div class="settings__item" id="settings-player-count-item" hidden>
          <label class="settings__item--label" for="settings-player-count">
            <span class="settings__item-icon" aria-hidden="true">👥</span>
            Nº de jugadores
          </label>
          <select id="settings-player-count" class="settings__select">
            <option value="2"${playerCount === 2 ? " selected" : ""}>2 jugadores</option>
            <option value="3"${playerCount === 3 ? " selected" : ""}>3 jugadores</option>
            <option value="4"${playerCount === 4 ? " selected" : ""}>4 jugadores</option>
          </select>
        </div>

        <div class="settings__item">
          <label class="settings__item--label" for="settings-music">
            <span class="settings__item-icon" aria-hidden="true">🎵</span>
            Música de fondo
          </label>
          <label class="settings__switch">
            <input
              type="checkbox"
              id="settings-music"
              class="settings__switch-input"
              ${musicEnabled ? "checked" : ""}
            />
            <span class="settings__switch-slider" aria-hidden="true"></span>
          </label>
        </div>
      </div>
    </section>
  `;

  // Referencias a elementos
  const modeSelect = container.querySelector("#settings-mode");
  const difficultySelect = container.querySelector("#settings-difficulty");
  const themeSelect = container.querySelector("#settings-theme");
  const nameInput = container.querySelector("#settings-player-name");
  const countSelect = container.querySelector("#settings-player-count");
  const musicSwitch = container.querySelector("#settings-music");

  // Inicializar visibilidad
  const nameItem = container.querySelector("#settings-player-name-item");
  const countItem = container.querySelector("#settings-player-count-item");
  updateVisibility(nameItem, countItem);

  modeSelect.addEventListener("change", handleModeChange);
  difficultySelect.addEventListener("change", handleDiffChange);
  themeSelect.addEventListener("change", handleThemeChange);
  nameInput.addEventListener("input", handleNameChange);
  countSelect.addEventListener("change", handleCountChange);
  musicSwitch.addEventListener("change", handleMusicChange);

  // Devolver función de limpieza
  return function cleanup() {
    modeSelect.removeEventListener("change", handleModeChange);
    difficultySelect.removeEventListener("change", handleDiffChange);
    themeSelect.removeEventListener("change", handleThemeChange);
    nameInput.removeEventListener("input", handleNameChange);
    countSelect.removeEventListener("change", handleCountChange);
    musicSwitch.removeEventListener("change", handleMusicChange);
    container.innerHTML = "";
  };
}
