import db from '../db.js';
import '../components/league-form.js';

export class LeaguesView {
  constructor({ router }) {
    this.router = router;
    this.container = null;
  }

  mount(container) {
    this.container = container;
    container.innerHTML = `
      <div class="page-header">
        <h1>Ligas</h1>
        <button class="btn btn-primary" id="create-league">+ Nueva Liga</button>
      </div>
      <loading-state message="Cargando ligas..."></loading-state>
    `;
    container.querySelector('#create-league').addEventListener('click', () => {
      const form = document.createElement('league-form');
      form.addEventListener('league-created', () => this.render());
      this.container.appendChild(form);
    });
    this.render();
  }

  async render() {
    const leagues = await db.getAll('leagues');
    const activeId = db.getActiveLeagueId();

    const list = this.container.querySelector('#league-list') || document.createElement('div');
    list.id = 'league-list';

    if (leagues.length === 0) {
      list.innerHTML = `<div class="empty-state"><p>No hay ligas creadas aún.</p></div>`;
    } else {
      list.className = 'card-grid';
      list.innerHTML = leagues.map(l => `
        <div class="card ${Number(activeId) === l.id ? 'active' : ''}" data-id="${l.id}">
          <h3>${l.name}</h3>
          <p>${l.sport} — ${l.temporada || ''}</p>
          <p>${l.modalidad === 'league' ? 'Liga' : 'Eliminación Directa'}</p>
          <div style="margin-top:0.5rem;display:flex;gap:0.25rem;flex-wrap:wrap">
            <button class="btn btn-sm btn-primary js-activate" data-id="${l.id}">Activar</button>
            <button class="btn btn-sm btn-secondary js-edit" data-id="${l.id}">Editar</button>
            <button class="btn btn-sm btn-danger js-delete" data-id="${l.id}">Eliminar</button>
          </div>
        </div>
      `).join('');

      list.querySelectorAll('.js-activate').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = Number(btn.dataset.id);
          await db.runTransaction(['leagues'], 'readwrite', (stores) => {
            const all = stores.leagues.getAll();
            all.onsuccess = () => {
              all.result.forEach(l => {
                stores.leagues.put({ ...l, isActive: l.id === id });
              });
            };
          });
          db.setActiveLeagueId(id);
          this.router.navigateTo('/dashboard');
        });
      });

      list.querySelectorAll('.js-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const form = document.createElement('league-form');
          form.setAttribute('edit-id', btn.dataset.id);
          form.addEventListener('league-updated', () => this.render());
          this.container.appendChild(form);
        });
      });

      list.querySelectorAll('.js-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const { ConfirmDialog } = await import('../components/confirm-dialog.js');
          const confirmed = await ConfirmDialog.show('Eliminar liga', '¿Eliminar esta liga y todos sus datos? Se borrarán equipos, jugadores, partidos y eventos asociados.');
          if (confirmed) {
            const id = Number(btn.dataset.id);
            await db.remove('leagues', id);
            this.render();
          }
        });
      });
    }

    const loader = this.container.querySelector('loading-state');
    if (loader) loader.remove();
    this.container.appendChild(list);
  }

  unmount() {
    this.container = null;
  }
}
