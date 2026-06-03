 export class PlayerBadge extends HTMLElement {
    constructor() {
        super();
        this.badge = document.createElement('article');
        this.badge.className = 'player-badge';
    }

    connectedCallback() {
        this.render();
      this.appendChild(this.badge)
    }

    updateStats(newPoints, newMovements) {
        const pointsEl = this.badge.querySelector('.points');
        const movementsEl = this.badge.querySelector('.movements');
        
        if (pointsEl) pointsEl.textContent = `Points: ${newPoints}`;
        if (movementsEl) movementsEl.textContent = `Movements: ${newMovements}`;
    }

    render() {
        const name = this.getAttribute('name') || 'Player';
        const points = parseInt(this.getAttribute('points')) || 0;
        const movements = parseInt(this.getAttribute('movements')) || 0;
        
        const playerName = document.createElement('h3');
        playerName.textContent = name;

        const stats = document.createElement('div');
        stats.className = 'stats';

        const pointsEl = document.createElement('p');
        pointsEl.className = 'points';
        pointsEl.textContent = `Points: ${points}`;

        const movementsEl = document.createElement('p');
        movementsEl.className = 'movements';
        movementsEl.textContent = `Movements: ${movements}`;

        this.badge.appendChild(playerName);
        this.badge.appendChild(stats);
        stats.appendChild(pointsEl);
        stats.appendChild(movementsEl);
        this.appendChild(this.badge);
        
    }
}
customElements.define('player-badge', PlayerBadge);