import { afterEveryRender, DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

import { ALTURA_CABECALHO_TABELA, ALTURA_LINHA_TABELA, linhasQueCabem } from './table-page';

@Directive({
  selector: '[appTablePageSize]',
})
export class TablePageSizeDirective {
  readonly appTablePageSize = output<number>();

  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private last = 0;

  constructor() {
    afterEveryRender(() => this.emitSize());
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => this.emitSize());
    observer.observe(this.host);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }

  private emitSize(): void {
    const cabecalho =
      (this.host.querySelector('thead th') as HTMLElement | null)?.getBoundingClientRect().height ||
      ALTURA_CABECALHO_TABELA;
    const linha =
      (this.host.querySelector('tbody tr') as HTMLElement | null)?.getBoundingClientRect().height ||
      ALTURA_LINHA_TABELA;
    const n = linhasQueCabem(this.host.clientHeight, linha, cabecalho);
    if (n === this.last) {
      return;
    }
    this.last = n;
    queueMicrotask(() => this.appTablePageSize.emit(n));
  }
}
