export class DeptCard extends HTMLElement {
  constructor() {
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

    const letter = (d.displayName || '?').charAt(0).toUpperCase();

    if (d.imageUrl) {
      const img = document.createElement('img');
      img.src = d.imageUrl;
      img.alt = d.displayName || 'Departamento';
      img.loading = 'lazy';
      img.onerror = () => {
        iconDiv.innerHTML = '';
        iconDiv.textContent = letter;
      };
      iconDiv.appendChild(img);
    } else {
      iconDiv.textContent = letter;
    }

    const cardBody = document.createElement('div');
    cardBody.className = 'dept-card-body';

    const title = document.createElement('h3');
    title.className = 'dept-title';
    title.textContent = d.displayName || 'Departamento desconocido';

    cardBody.appendChild(title);
    card.appendChild(iconDiv);
    card.appendChild(cardBody);

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