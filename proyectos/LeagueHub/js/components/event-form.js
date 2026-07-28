export class EventForm extends HTMLElement {
  connectedCallback() {
    this.buildDOM();
  }

  buildDOM() {
    this.innerHTML = `<p>Formulario de eventos — implementación pendiente.</p>`;
  }
}
customElements.define('event-form', EventForm);
