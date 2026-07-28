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
    this.render();
  }

  async render() {
    const { getAll, getActiveLeagueId, setActiveLeagueId } = await import('../db.js');
    const leagues = await getAll('leagues');
    const activeId = getActiveLeagueId();

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
          const { getAll, put } = await import('../db.js');
          await runTransaction(['leagues'], 'readwrite', (stores) => {
            const all = stores.leagues.getAll();
            all.onsuccess = () => {
              all.result.forEach(l => {
                stores.leagues.put({ ...l, isActive: l.id === id });
              });
            };
          });
          setActiveLeagueId(id);
          this.router.navigateTo('/dashboard');
        });
      });

      list.querySelectorAll('.js-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const { ConfirmDialog } = await import('../components/confirm-dialog.js');
          const confirmed = await ConfirmDialog.show('Eliminar liga', '¿Eliminar esta liga y todos sus datos? Se borrarán equipos, jugadores, partidos y eventos asociados.');
          if (confirmed) {
            const id = Number(btn.dataset.id);
            const { remove } = await import('../db.js');
            await remove('leagues', id);
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
