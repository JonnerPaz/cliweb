export class ArtCard extends HTMLElement {
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
    card.className = 'card';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'card-img-container';

    const img = document.createElement('img');
    img.src = d.primaryImageSmall || '';
    img.alt = d.title || 'Arte';

    if (!d.primaryImageSmall) {
      img.style.display = 'none';
    }

    imgContainer.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = d.title || 'Título desconocido';

    const artist = document.createElement('p');
    artist.className = 'card-text';
    artist.textContent = d.artistDisplayName || 'Artista desconocido';

    const meta = document.createElement('p');
    meta.className = 'card-meta';
    const date = d.objectDate || '—';
    const dept = d.department || '—';
    meta.textContent = `${date} · ${dept}`;

    cardBody.appendChild(title);
    cardBody.appendChild(artist);
    cardBody.appendChild(meta);

    card.appendChild(imgContainer);
    card.appendChild(cardBody);

    card.addEventListener('click', () => {
      if (d.objectID) {
        window.location.hash = `#detail/${d.objectID}`;
      }
    });

    this.appendChild(card);
  }

  connectedCallback() {
    if (this._data) this.render();
  }
}
customElements.define('art-card', ArtCard);
