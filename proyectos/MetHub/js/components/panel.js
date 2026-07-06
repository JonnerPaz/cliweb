export class ComparePanel {
  constructor(api, onSelect) {
    this.api = api;
    this.onSelect = onSelect;
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
      const objects = await Promise.allSettled(ids.map(id => this.api.getObject(id)));
      
      this.#renderResults(objects.filter(result => result.status === 'fulfilled').map(result => result.value));
    } catch (err) {
      resultsContainer.textContent = 'Error al buscar';
    }
  }

  #renderResults(objects) {
    const resultsContainer = this.container.querySelector('.results-cascading');
    resultsContainer.innerHTML = '';
    
    objects.forEach(obj => {
      const card = document.createElement('div');
      card.className = 'mini-card';
      
      const img = document.createElement('img');
      img.src = obj.primaryImageSmall;
      img.alt = obj.title;
      
      const title = document.createElement('span');
      title.textContent = obj.title;

      card.appendChild(img);
      card.appendChild(title);
      card.onclick = () => this.#select(obj);
      resultsContainer.appendChild(card);
    });
  }

  #select(obj) {
    this.selectedObject = obj;
    this.container.innerHTML = ''; 

    const view = document.createElement('div');
    view.className = 'selected-view';

    const title = document.createElement('h3');
    title.textContent = obj.title;

    const btn = document.createElement('button');
    btn.className = 'change-btn';
    btn.textContent = 'Cambiar selección';
    btn.onclick = () => {
      this.selectedObject = null;
      this.#renderInitialState();
      this.onSelect(null);
    };

    view.appendChild(title);
    view.appendChild(btn);
    this.container.appendChild(view);
    
    this.onSelect(obj);
  }
}