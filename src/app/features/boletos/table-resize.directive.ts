import { afterEveryRender, Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

import { PoTableColumnResize } from './po-table-column-resize';

@Directive({
  selector: '[appTableResize]',
})
export class TableResizeDirective {
  readonly columns = input.required<PoTableColumn[]>({ alias: 'appTableResize' });

  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private helper: PoTableColumnResize | null = null;

  constructor() {
    afterEveryRender(() => this.ensureHelper().reapply());
  }

  resizeColumn(property: string, widthPx: number): void {
    this.ensureHelper().resizeColumn(property, widthPx);
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.ensureHelper().onPointerDown(event);
    this.syncDraggingClass();
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    this.ensureHelper().onPointerMove(event);
  }

  @HostListener('pointerup')
  @HostListener('pointercancel')
  onPointerUp(): void {
    this.ensureHelper().onPointerUp();
    this.syncDraggingClass();
  }

  private ensureHelper(): PoTableColumnResize {
    if (!this.helper) {
      this.host.classList.add('table-resize');
      this.helper = new PoTableColumnResize(this.host, this.columns());
    }
    return this.helper;
  }

  private syncDraggingClass(): void {
    this.host.classList.toggle('table-resize--dragging', this.ensureHelper().resizing);
  }
}
