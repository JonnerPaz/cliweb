export class GameTimer extends HTMLElement {
    constructor() {
        super();
        this.timer = document.createElement('div');
        this.timer.className = 'game-timer';
        }

        connectedCallback() {
        this.render();
        this.appendChild(this.timer);
        }
            
        render() {
            const label = document.createElement('span');
            label.className = 'label';
            label.textContent = 'Time: ';
            this.timer.appendChild(label);
    }

    updateTime(seconds) {
        // Pendiente verificar una vez tengamos el timer.js en core
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        if (this.valueElement) {
            this.valueElement.textContent = `${mins}:${secs}`;
        }
    }
}

customElements.define('game-timer', GameTimer);