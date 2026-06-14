/**
 * @param {HTMLElement} rootElement - El contenedor principal (ej. #app)
 * @param {Object} routes - Mapa de rutas, ej. { "/": () => new Home() }
 * @description Clase que maneja el enrutamiento de la aplicación. Estas rutas DEBEN tener entre sus métodos mount() y unmount()
 * @example
 * const routes = {
 *   "/": () => new View(),
 }
 */
export class Router {
  constructor(rootElement, routes) {
    this.rootElement = rootElement;
    this.routes = routes;
    this.currentView = null; // La vista actual. Monta y desmonta según la ruta

    // Inicia el router
    this._init();
  }

  _init() {
    // El evento "hashchange" se dispara cuando cambia el # de la URL (incluye atrás/adelante)
    window.addEventListener("hashchange", () => this.handleRoute());

    // Renderiza la ruta inicial al cargar la página
    this.handleRoute();
  }

  handleRoute() {
    // Obtenemos el hash actual, o por defecto "/"
    let path = window.location.hash.slice(1) || "/";

    // Obtenemos el handler de la ruta o el home. Es una función
    const routeHandler = this.routes[path] || this.routes["/"];

    // Desmontamos la vista anterior (se borra del DOM)
    if (this.currentView && typeof this.currentView.unmount === "function") {
      this.currentView.unmount();
    }

    // Limpiamos el contenedor
    this.rootElement.innerHTML = "";

    // Instanciamos la nueva vista
    this.currentView = routeHandler();

    // Montamos la vista en el contenedor
    if (this.currentView && typeof this.currentView.mount === "function") {
      this.currentView.mount(this.rootElement);
    }
  }

  /**
   * @param {string} path - La ruta a navegar
   * @description Navega a la ruta indicada y actualiza la URL
   */
  navigateTo(path) {
    window.location.hash = path;
  }
}
