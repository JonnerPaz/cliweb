import gameState from '../state/GameState.js';
import { createGameTimer } from './timer.js';
import { createPlayerBadge } from './playerBadge.js';

export function createHudMenu(players, gameMode) {
    const hudContainer = document.createElement('nav');
    hudContainer.id = 'game-hud';
    hudContainer.className = 'hud-menu';

    // Guardamos las referencias de los badges para actualizarlos luego
    const badgeElements = [];

    const players = gameState.players;
    const gameMode = gameState.gameMode;

    // Iteramos los jugadores (funciona para 1 o 2 jugadores)
    players.forEach((player, index) => {
        const badge = createPlayerBadge(player);
        // Si es PvP, podemos resaltar al primer jugador
        if (index === 0) badge.element.classList.add('is-active');
        hudContainer.appendChild(badge.element);
        badgeElements.push(badge);
    });

    let timerComponent = null;

    if (gameMode === 'solo') {
        timerComponent = createGameTimer();
        hudContainer.appendChild(timerComponent.element);
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
                    badge.element.classList.add('is-active');
                } else {
                    badge.element.classList.remove('is-active');
                }
            });
        }
    };
}