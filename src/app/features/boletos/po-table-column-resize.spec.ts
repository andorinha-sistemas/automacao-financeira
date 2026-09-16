import { describe, expect, it } from 'vitest';

import { PoTableColumnResize } from './po-table-column-resize';

function mountTable(): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <table>
      <thead>
        <tr>
          <th class="po-table-column-selectable"></th>
          <th>Filial</th>
          <th>Nome</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="po-table-column-selectable"></td>
          <td>D MG</td>
          <td>CAIXINHA</td>
        </tr>
      </tbody>
    </table>
  `;
  document.body.appendChild(host);
  return host;
}

describe('PoTableColumnResize', () => {
  it('applies a pixel width to the matching data column, skipping the selectable cell', () => {
    const host = mountTable();
    const resize = new PoTableColumnResize(host, [
      { property: 'filial', label: 'Filial' },
      { property: 'nome', label: 'Nome' },
    ]);

    resize.resizeColumn('nome', 160);

    const th = host.querySelector('thead th:nth-child(3)') as HTMLElement;
    const td = host.querySelector('tbody td:nth-child(3)') as HTMLElement;
    expect(th.style.width).toBe('160px');
    expect(th.style.minWidth).toBe('160px');
    expect(td.style.width).toBe('160px');
    host.remove();
  });

  it('clamps resized width to a 48px minimum', () => {
    const host = mountTable();
    const resize = new PoTableColumnResize(host, [{ property: 'filial', label: 'Filial' }]);

    resize.resizeColumn('filial', 10);

    const th = host.querySelector('thead th:nth-child(2)') as HTMLElement;
    expect(th.style.width).toBe('48px');
    host.remove();
  });
});
