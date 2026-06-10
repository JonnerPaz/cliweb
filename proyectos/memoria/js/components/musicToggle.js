import gameState from "../state/GameState.js";

export function createMusicToggle() {
  const btn = document.createElement("button");
  btn.id = "music-toggle";
  btn.className = "music-toggle";

  const updateIcon = () => {
    btn.textContent = gameState.musicEnabled ? "🔊" : "🔇";
  };

  updateIcon();

  btn.addEventListener("click", () => {
    const enabled = !gameState.musicEnabled;
    gameState.musicEnabled = enabled;
    updateIcon();
    window.dispatchEvent(
      new CustomEvent("music-setting-changed", { detail: { enabled } })
    );
  });

  window.addEventListener("music-setting-changed", (e) => {
    gameState.musicEnabled = e.detail.enabled;
    updateIcon();
  });

  return { element: btn };
}
