import { Component, input, output, signal } from '@angular/core';
import { PoButtonModule } from '@po-ui/ng-components';

import { AcaoSidebar } from '../../boletos.model';

@Component({
  selector: 'app-action-sidebar',
  imports: [PoButtonModule],
  templateUrl: './action-sidebar.html',
  styleUrl: './action-sidebar.css',
  host: {
    '[class.recolhido]': 'recolhido()',
  },
})
export class ActionSidebar {
  readonly actions = input.required<AcaoSidebar[]>();
  readonly acao = output<AcaoSidebar>();
  readonly abertos = signal<ReadonlySet<string>>(new Set());
  readonly recolhido = signal(false);

  temFilhos(action: AcaoSidebar): boolean {
    return (action.children?.length ?? 0) > 0;
  }

  estaAberto(id: string): boolean {
    return this.abertos().has(id);
  }

  onGrupo(action: AcaoSidebar): void {
    this.alternarGrupo(action.id);
  }

  alternarGrupo(id: string): void {
    const next = new Set(this.abertos());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.abertos.set(next);
  }

  alternarRecolher(): void {
    this.recolhido.update((v) => !v);
  }
}
