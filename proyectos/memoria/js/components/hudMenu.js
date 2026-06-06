import { createGameTimer } from './timer.js';
import { createPlayerBadge } from './playerBadge.js';

export function createHudMenu(player, gameMode) {
    const hudContainer = document.createElement('nav');
    hudContainer.id = 'game-hud';
    hudContainer.className = 'hud-menu';

    const badgeElement = createPlayerBadge(player);
    hudContainer.appendChild(badgeElement);

    let timerComponent = null;

    if (gameMode === 'solo') {
        timerComponent = createGameTimer();
        hudContainer.appendChild(timerComponent.element);
    }

    return {
        element: hudContainer,
        
        updatePlayerStats: () => {
            badgeElement.refresh();
        },
        
        updateTimer: (segundosActuales) => {
            if (timerComponent && timerComponent.updateTime) {
                timerComponent.updateTime(segundosActuales);
            }
        }
    };
}