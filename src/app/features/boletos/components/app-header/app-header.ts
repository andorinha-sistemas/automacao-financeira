import { Component, input, output } from '@angular/core';

import { BoletosContexto } from '../../boletos.model';

@Component({
  selector: 'app-fin-header',
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  readonly context = input.required<BoletosContexto>();
  readonly sair = output<void>();
}
