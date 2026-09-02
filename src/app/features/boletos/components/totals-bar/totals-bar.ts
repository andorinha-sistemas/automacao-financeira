import { Component, input } from '@angular/core';

import { formatBrl } from '../../boletos.logic';
import { TotaisBoletos } from '../../boletos.model';

@Component({
  selector: 'app-totals-bar',
  templateUrl: './totals-bar.html',
  styleUrl: './totals-bar.css',
})
export class TotalsBar {
  readonly totais = input.required<TotaisBoletos>();
  readonly formatBrl = formatBrl;
}
