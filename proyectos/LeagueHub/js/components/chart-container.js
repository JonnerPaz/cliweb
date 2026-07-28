export class ChartContainer extends HTMLElement {
  connectedCallback() {
    const canvas = document.createElement('canvas');
    this.appendChild(canvas);
    this.canvas = canvas;
    this.chart = null;
  }

  render(config) {
    if (this.chart) {
      this.chart.destroy();
    }
    if (typeof Chart !== 'undefined') {
      this.chart = new Chart(this.canvas, config);
    }
  }

  disconnectedCallback() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
customElements.define('chart-container', ChartContainer);
