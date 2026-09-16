import { PoTableColumn } from '@po-ui/ng-components';

export class PoTableColumnResize {
  private readonly columnWidths = new Map<string, number>();
  private drag: { property: string; startX: number; startWidth: number } | null = null;
  resizing = false;

  constructor(
    private readonly host: HTMLElement,
    private readonly columns: PoTableColumn[],
  ) {}

  reapply(): void {
    this.columnWidths.forEach((width, property) => this.applyColumnWidth(property, width));
  }

  resizeColumn(property: string, widthPx: number): void {
    const width = Math.max(48, Math.round(widthPx));
    this.columnWidths.set(property, width);
    const col = this.columns.find((c) => c.property === property);
    if (col) {
      col.width = `${width}px`;
    }
    this.applyColumnWidth(property, width);
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    const th = (event.target as HTMLElement).closest('thead th');
    if (!th || th.classList.contains('po-table-column-selectable')) return;
    const rect = th.getBoundingClientRect();
    if (event.clientX < rect.right - 8) return;
    const index = [...th.parentElement!.children].indexOf(th);
    const property = this.columns[index - 1]?.property;
    if (!property) return;
    event.preventDefault();
    event.stopPropagation();
    this.drag = { property, startX: event.clientX, startWidth: rect.width };
    this.resizing = true;
    try {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    } catch {
      return;
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.drag) return;
    this.resizeColumn(this.drag.property, this.drag.startWidth + (event.clientX - this.drag.startX));
  }

  onPointerUp(): void {
    this.drag = null;
    this.resizing = false;
  }

  private applyColumnWidth(property: string, width: number): void {
    const index = this.columns.findIndex((c) => c.property === property);
    if (index < 0) return;
    const nth = index + 2;
    const cells = Array.from(
      this.host.querySelectorAll(`thead th:nth-child(${nth}), tbody td:nth-child(${nth})`),
    ) as HTMLElement[];
    for (const el of cells) {
      el.style.width = `${width}px`;
      el.style.minWidth = `${width}px`;
      el.style.maxWidth = `${width}px`;
    }
    this.syncFrozenOffsets();
  }

  private syncFrozenOffsets(): void {
    const rows = Array.from(this.host.querySelectorAll('table tr')) as HTMLTableRowElement[];
    for (const row of rows) {
      let left = 0;
      const cells = Array.from(row.children) as HTMLElement[];
      for (const el of cells) {
        if (
          !el.classList.contains('po-frozen-column') &&
          !el.classList.contains('po-table-column-selectable')
        ) {
          continue;
        }
        el.style.left = `${left}px`;
        left += el.getBoundingClientRect().width;
      }
    }
  }
}
