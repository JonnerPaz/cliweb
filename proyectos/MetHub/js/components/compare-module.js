import { ComparePanel } from './panel.js';

export class CompareModule {
  constructor(api) {
    this.api = api;
    this.selections = { left: null, right: null };

    this.container = document.createElement('div');
    this.container.className = 'compare-module';

    this.panelsWrapper = document.createElement('div');
    this.panelsWrapper.className = 'panels-wrapper';

    this.panelLeft = new ComparePanel(
      this.api,
      (obj) => this.#handleSelect('left', obj),
      (id) => this.selections.right?.objectID === id
    );

    this.panelRight = new ComparePanel(
      this.api,
      (obj) => this.#handleSelect('right', obj),
      (id) => this.selections.left?.objectID === id
    );

    this.panelsWrapper.append(this.panelLeft.container, this.panelRight.container);

    this.tableContainer = document.createElement('div');
    this.tableContainer.className = 'table-container-wrapper';

    this.container.append(this.panelsWrapper, this.tableContainer);
  }

  #handleSelect(side, obj) {
    const otherSide = side === 'left' ? 'right' : 'left';
    if (obj && this.selections[otherSide]?.objectID === obj.objectID) {
      alert('Esta obra ya está seleccionada en el otro panel.');
      return;
    }

    this.selections[side] = obj;
    this.#updateComparisonTable();
  }

  #updateComparisonTable() {
    this.tableContainer.innerHTML = '';
    const { left, right } = this.selections;

    if (!left || !right) return;

    const table = document.createElement('table');
    table.className = 'comparison-table';

    const criteria = [
      { label: 'Artista', key: 'artistDisplayName' },
      { label: 'Año', key: 'objectEndDate' },
      { label: 'Departamento', key: 'department' },
      { label: 'Técnica', key: 'medium' },
      { label: 'Clasificación', key: 'classification' },
      { label: 'Cultura', key: 'culture' },
      { label: '¿Destacada?', key: 'isHighlight', format: (v) => (v ? 'Sí' : 'No') },
      { label: '¿Dominio Público?', key: 'isPublicDomain', format: (v) => (v ? 'Sí' : 'No') },
    ];

    criteria.forEach((c) => {
      const row = document.createElement('tr');
      const valLeft = left[c.key];
      const valRight = right[c.key];

      if (valLeft !== valRight) {
        row.className = 'diff-highlight';
      }

      const labelCell = document.createElement('td');
      labelCell.textContent = c.label;

      const leftCell = document.createElement('td');
      leftCell.textContent = c.format ? c.format(valLeft) : valLeft || 'N/A';

      const rightCell = document.createElement('td');
      rightCell.textContent = c.format ? c.format(valRight) : valRight || 'N/A';

      row.append(labelCell, leftCell, rightCell);
      table.appendChild(row);
    });

    this.tableContainer.appendChild(table);
    this.#renderYearDiff(left, right);
  }

  #renderYearDiff(o1, o2) {
    const y1 = parseInt(o1.objectEndDate, 10);
    const y2 = parseInt(o2.objectEndDate, 10);

    if (!Number.isNaN(y1) && !Number.isNaN(y2)) {
      const diff = document.createElement('p');
      diff.className = 'year-diff-msg';
      diff.textContent = `Diferencia temporal: ${Math.abs(y1 - y2)} años.`;
      this.tableContainer.appendChild(diff);
    }
  }

  async preloadLeft(id) {
    const obj = await this.api.getObjectById(id);
    if (obj) {
      this.panelLeft.setPreselected(obj);
      this.selections.left = obj;
      this.#updateComparisonTable();
    }
  }
}
