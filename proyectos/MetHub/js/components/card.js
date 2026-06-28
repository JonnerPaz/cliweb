export class Card extends HTMLElement {
  constructor() {
    super();

    this.imgContainer = document.createElement('div');
    this.img = document.createElement('img');
    this.cardBody = document.createElement('div');
    this.cardTitle = document.createElement('h3');
    this.cardText = document.createElement('p');

  }

  connectedCallback() {
    this.render();
    this.update(); 
  }

  render() {
    
    this.imgContainer.className = 'card-img-container';
    this.cardBody.className = 'card-body';
    this.cardTitle.className = 'card-title';
    this.cardText.className = 'card-text';

    this.imgContainer.appendChild(this.img);
    this.cardBody.appendChild(this.cardTitle);
    this.cardBody.appendChild(this.cardText);
    this.appendChild(this.imgContainer);
    this.appendChild(this.cardBody);

  }

  set data(value) {
    this._data = value;
    if (this.isConnected) {
      this.update();
    }
  }

  get data() {
    return this._data;
  }

  update() {
    const data = this._data || {};
    this.img.src = data.primaryImageSmall || 'https://via.placeholder.com/400x220?text=No+Image';
    this.img.alt = data.title || 'Arte';
    this.cardTitle.textContent = data.title || 'Título desconocido';
    this.cardText.textContent = data.artistDisplayName || 'Artista desconocido';
  }
}

customElements.define('met-card', Card);
console.log('met-card registered');
