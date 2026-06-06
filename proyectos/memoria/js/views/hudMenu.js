import { createHudMenu } from './hudMenu.js';
import { User } from './models/User.js'; 

const player = new User("Player", 0, 0, 0);

const currentMode = 'solo'; 

// Instanciamos el HUD pasándole el jugador y el modo
const hud = createHudMenu(player, currentMode);
document.body.appendChild(hud.element);

function handleWin() {
    player.addPoints(100);
    hud.updatePlayerStats();
}


function onTick(segundos) {
    hud.updateTimer(segundos);
}