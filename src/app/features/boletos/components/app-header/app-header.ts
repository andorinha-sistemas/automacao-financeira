import { Component, output } from '@angular/core';

@Component({
  selector: 'app-fin-header',
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  readonly sair = output<void>();
}
