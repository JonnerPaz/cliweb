import gameState from "../state/GameState.js";
import { createGameTimer } from "./timer.js";
import { createPlayerBadge } from "./playerBadge.js";

export function createHudMenu({ onFinish } = {}) {
  const hudContainer = document.createElement("nav");
  hudContainer.id = "game-hud";
  hudContainer.className = "hud-menu";

  const badgeElements = [];

  const players = gameState.players;
  const gameMode = gameState.gameMode;

  players.forEach((player, index) => {
    const badge = createPlayerBadge(player);
    if (index === 0) badge.element.classList.add("is-active");
    hudContainer.appendChild(badge.element);
    badgeElements.push(badge);
  });

  let timerComponent = null;

  if (gameMode === "solo" || gameMode === "free") {
    timerComponent = createGameTimer();
    hudContainer.appendChild(timerComponent.element);
  }

  if (gameMode === "free") {
    const finishBtn = document.createElement("button");
    finishBtn.className = "pokemon-button";
    finishBtn.textContent = "Terminar";
    finishBtn.addEventListener("click", () => onFinish?.());
    hudContainer.appendChild(finishBtn);
  }

  return {
    element: hudContainer,

    updatePlayerStats: () => {
      const currentPlayers = gameState.players;

      badgeElements.forEach((badge, index) => {
        const player = currentPlayers[index];
        if (player && badge.updatePlayerStats) {
          badge.updatePlayerStats(player.points, player.movements);
        }
      });
    },

    updateTimer: (segundosActuales) => {
      if (timerComponent && timerComponent.updateTime) {
        timerComponent.updateTime(segundosActuales);
      }
    },

    updateTurn: (currentPlayerIndex) => {
      badgeElements.forEach((badge, index) => {
        if (index === currentPlayerIndex) {
          badge.element.classList.add("is-active");
        } else {
          badge.element.classList.remove("is-active");
        }
      });
    },
  };
}

