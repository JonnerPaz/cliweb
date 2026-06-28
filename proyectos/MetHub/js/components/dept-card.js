export class DeptCard extends HTMLElement {
    constructor(data, onClick) {
        super();
        this._data = null; 
  }

    set data(value) {
    this._data = value;
    this.render();
  }

  get data() {
    return this._data;
  }

  render() {
    this.innerHTML = '';
    const d = this._data || {};

    const card = document.createElement('article');
    card.className = 'dept-card';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'dept-icon';
    
    /* Icono con la Inicial del departamento 
    Solucion temporal mientras evaluo si hacer un icono para cada uno*/
    const letter = (d.displayName || '?').charAt(0).toUpperCase();
    iconDiv.textContent = letter;

    const title = document.createElement('h3');
    title.className = 'dept-title';
    title.textContent = d.displayName || 'Departamento desconocido';

    cardBody.appendChild(title);
    card.appendChild(iconDiv);

    card.addEventListener('click', () => {
      if (d.departmentId) {
      window.location.hash = `#explore/${d.departmentId}`;      
    }
    });

    this.appendChild(card);
  }

  connectedCallback() {
    if (this._data) this.render();
  }
}
customElements.define('dept-card', DeptCard);