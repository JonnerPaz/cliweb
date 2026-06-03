/**
 * @param {HTMLElement} rootElement - El contenedor principal (ej. #app)
 * @param {Object} routes - Mapa de rutas, ej. { "/": () => new Home() }
 */
export class Router {
  constructor(rootElement, routes) {
    this.rootElement = rootElement;
    this.routes = routes;

    // Inicia el router
    this._init();
  }

  _init() {
    // El evento "popstate" se dispara cuando intercepta los botones atrás/adelante del navegador
    window.addEventListener("popstate", () => this.handleRoute());

    // Intercepta clicks en enlaces que tengan el atributo data-link
    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.getAttribute("href"));
      }
    });

    // Renderiza la ruta inicial al cargar la página
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;

    // Obtenemos el componente de la ruta actual, si no existe, vamos a Home (/)
    const routeHandler = this.routes[path] || this.routes["/"];

    // Limpiamos el contenedor (Lo que haya en este momento en la página)
    this.rootElement.innerHTML = "";

    // Si la ruta devuelve un HTMLElement (componente), lo agregamos al DOM
    const pageComponent = routeHandler();
    if (pageComponent instanceof HTMLElement) {
      this.rootElement.appendChild(pageComponent);
    }
  }

  /**
   * @param {string} path
   */
  navigateTo(path) {
    window.history.pushState({}, "", path);
    this.handleRoute();
  }
}
