import { Component, computed, input, model } from '@angular/core';
import { PoButtonModule } from '@po-ui/ng-components';

import { rotuloPagina, TAMANHO_PAGINA, totalPaginas } from '../../table-page';

@Component({
  selector: 'app-table-pager',
  imports: [PoButtonModule],
  templateUrl: './table-pager.html',
  styleUrl: './table-pager.css',
})
export class TablePager {
  readonly total = input.required<number>();
  readonly pagina = model(1);
  readonly tamanho = input(TAMANHO_PAGINA);

  readonly rotulo = computed(() => rotuloPagina(this.total(), this.pagina(), this.tamanho()));
  readonly temAnterior = computed(() => this.pagina() > 1);
  readonly temProxima = computed(() => this.pagina() < totalPaginas(this.total(), this.tamanho()));

  anterior(): void {
    if (this.temAnterior()) {
      this.pagina.update((p) => p - 1);
    }
  }

  proxima(): void {
    if (this.temProxima()) {
      this.pagina.update((p) => p + 1);
    }
  }
}
