export class Toast extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.toast = document.createElement('div');
        this.toast.className = 'custom-toast';
        this.timer = null;
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.appendChild(this.toast);

        this.timer = setTimeout(() => {
            this.toast.classList.add('hide');
            this.remove();
        }, 3000);
    }

    disconnectedCallback() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    render() {
        const message = this.getAttribute('message') || 'Congratulations!';
        const type = this.getAttribute('type') || 'success'; 

        this.toast.className = `custom-toast ${type}`;
        this.toast.textContent = message;

        // Inyectamos los estilos directamente en el Shadow DOM de forma segura
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    font-family: system-ui, -apple-system, sans-serif;
                }

                .toast-message {
                    min-width: 250px;
                    padding: 14px 20px;
                    border-radius: 8px;
                    color: #ffffff;
                    font-weight: 500;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    animation: slideIn 0.3s ease-out forwards;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }

                .success { background-color: #10b981; }
                .error { background-color: #ef4444; }
                .info { background-color: #3b82f6; }

                .toast-message.hide {
                    opacity: 0;
                    transform: translateY(20px);
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
        `;

    }
}
customElements.define('custom-toast', Toast);