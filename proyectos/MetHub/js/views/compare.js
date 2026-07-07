import { CompareModule } from '../components/compare-module.js';

export class CompareView {
  constructor({ api, router, preselectId = null }) {
    this.api = api;
    this.router = router;
    this.preselectId = preselectId;
    this.module = new CompareModule(api);
    this.container = document.createElement('section');
    this.container.className = 'compare-view';
  }

  mount(container) {
    this.container.innerHTML = '';
    this.container.appendChild(this.module.container);
    container.appendChild(this.container);

    if (this.preselectId) {
      this.module.preloadLeft(this.preselectId).catch(() => {
      });
    }
  }

  unmount() {
    this.container.innerHTML = '';
  }
}