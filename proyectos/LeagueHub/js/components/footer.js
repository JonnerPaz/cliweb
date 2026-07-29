export class AppFooter extends HTMLElement {
  connectedCallback() {
    this.buildDOM();
  }

  buildDOM() {
    this.innerHTML = `
      <footer>
        <p>LeagueHub &copy; 2026</p>
        <span class="db-status" id="db-status">IndexedDB: Conectando...</span>
      </footer>
    `;
  }

  setDbStatus(text, isError) {
    const status = this.querySelector("#db-status");
    if (status) {
      status.textContent = text;
      status.style.color = isError ? "#ef4444" : "#4ade80";
    }
  }
}
customElements.define("app-footer", AppFooter);