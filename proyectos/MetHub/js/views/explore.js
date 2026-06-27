export class ExploreView {
  constructor({ api, router }) {
    this.api = api;
    this.router = router;
    this.abortController = null;
  }

  mount(container) {
    this.abortController = new AbortController();
    this.container = container;
    container.innerHTML = "";
  }

  unmount() {
    this.abortController?.abort();
  }
}
