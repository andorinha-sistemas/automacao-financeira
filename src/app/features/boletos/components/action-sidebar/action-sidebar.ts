import { Component, input, output } from '@angular/core';
import { PoButtonModule } from '@po-ui/ng-components';

import { AcaoSidebar } from '../../boletos.model';

@Component({
  selector: 'app-action-sidebar',
  imports: [PoButtonModule],
  templateUrl: './action-sidebar.html',
  styleUrl: './action-sidebar.css',
})
export class ActionSidebar {
  readonly actions = input.required<AcaoSidebar[]>();
  readonly acao = output<AcaoSidebar>();
}
