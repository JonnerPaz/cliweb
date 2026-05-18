// MiBoton — un Custom Element nativo.
// El navegador lo trata como una etiqueta HTML real porque extiende HTMLElement
// y lo registramos con customElements.define().
class MiBoton extends HTMLElement {
  constructor() {
    super(); // obligatorio cuando se extiende HTMLElement
  }

  // Se ejecuta automáticamente cuando el elemento se inserta en el DOM.
  // Aquí es donde montamos el contenido interno.
  connectedCallback() {
    const texto = this.getAttribute("texto") || "Sin texto";
    const mensaje = this.getAttribute("mensaje") || `Clickeaste: ${texto}`;

    // Construimos el botón real
    const button = document.createElement("button");
    button.textContent = texto;
    button.classList.add("boton");
    button.addEventListener("click", () => alert(mensaje));

    this.appendChild(button);
  }
}

// Registra <mi-boton> como etiqueta del navegador.
// El nombre DEBE contener un guion — esa es la regla de los Custom Elements.
customElements.define("mi-boton", MiBoton);
