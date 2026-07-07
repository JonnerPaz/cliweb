export class ComparePanel {
  constructor(api, onSelect, checkBlocked = () => false) {
    this.api = api;
    this.onSelect = onSelect;
    this.checkBlocked = checkBlocked;
    this.selectedObject = null;
    this.container = document.createElement('div');
    this.container.className = 'compare-panel';
    this.#renderInitialState();
  }

  #renderInitialState() {
    this.container.innerHTML = '';

    const searchArea = document.createElement('div');
    searchArea.className = 'search-area';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Busca una obra por nombre, artista, tema...';
    input.className = 'panel-search-input';

    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-cascading';

    searchArea.appendChild(input);
    searchArea.appendChild(resultsContainer);
    this.container.appendChild(searchArea);

    let timer;
    input.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => this.#performSearch(e.target.value), 400);
    });
  }

  async #performSearch(query) {
    if (!query) return;

    const resultsContainer = this.container.querySelector('.results-cascading');
    resultsContainer.textContent = 'Cargando...';

    try {
      const { objectIDs } = await this.api.searchObjects({ q: query, hasImages: true });
      if (!objectIDs || objectIDs.length === 0) {
        resultsContainer.textContent = 'No se encontraron obras';
        return;
      }

      const ids = objectIDs.slice(0, 5);
      const fetchObject = typeof this.api.getObject === 'function'
        ? (id) => this.api.getObject(id)
        : (id) => this.api.getObjectById(id);

      const objects = await Promise.allSettled(ids.map(fetchObject));
      const results = objects
        .filter((result) => result.status === 'fulfilled' && result.value)
        .map((result) => result.value);

      this.#renderResults(results, this.checkBlocked);
    } catch (err) {
      resultsContainer.textContent = 'Error al buscar. ';
      const retryBtn = document.createElement('button');
      retryBtn.textContent = 'Reintentar';
      retryBtn.onclick = () => this.#performSearch(query);
      resultsContainer.appendChild(retryBtn);
    }
  }

  #renderResults(objects, checkDisabledFn = () => false) {
    const resultsContainer = this.container.querySelector('.results-cascading');
    resultsContainer.textContent = '';

    objects.forEach((obj) => {
      const card = document.createElement('div');
      card.className = 'mini-card';

      const isDisabled = checkDisabledFn(obj.objectID);

      if (isDisabled) {
        card.classList.add('disabled');
        card.title = 'Ya está seleccionada en el otro panel';
      } else {
        card.onclick = () => this.#select(obj);
      }

      const img = document.createElement('img');
      img.src = obj.primaryImageSmall || 'placeholder.jpg';
      img.alt = obj.title;

      const title = document.createElement('span');
      title.textContent = obj.title;

      const artist = document.createElement('small');
      artist.textContent = obj.artistDisplayName || 'Artista desconocido';

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(artist);
      resultsContainer.appendChild(card);
    });
  }

  #select(obj) {
    this.selectedObject = obj;
    this.container.innerHTML = '';

    const view = document.createElement('div');
    view.className = 'selected-view';

    const img = document.createElement('img');
    img.src = obj.primaryImageSmall;
    img.alt = obj.title;

    const title = document.createElement('h3');
    title.textContent = obj.title;

    const artist = document.createElement('p');
    artist.textContent = obj.artistDisplayName || 'Artista desconocido';

    const btn = document.createElement('button');
    btn.className = 'change-btn'; 
    btn.textContent = 'Cambiar selección';
    btn.onclick = () => {
      this.selectedObject = null;
      this.#renderInitialState();
      this.onSelect(null);
    };

    view.append(img, title, artist, btn);
    this.container.appendChild(view);

    this.onSelect(obj);
  }

  setPreselected(obj) {
    this.#select(obj);
  }
}