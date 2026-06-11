import { musicService } from "../core/musicService.js";

export function createMusicToggle() {
  const btn = document.createElement("button");
  btn.id = "music-toggle";
  btn.className = "music-toggle";

  const updateIcon = () => {
    btn.textContent = musicService.enabled ? "🔊" : "🔇";
  };

  updateIcon();

  btn.addEventListener("click", () => {
    musicService.toggle();
  });

  musicService.onChange(() => updateIcon());

  return { element: btn };
}
