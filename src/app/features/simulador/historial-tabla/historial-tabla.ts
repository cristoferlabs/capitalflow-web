import { Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { InversionConUsuario } from '../../../core/models/inversion.model';

@Component({
  selector: 'app-historial-tabla',
  imports: [CurrencyPipe, DatePipe, PercentPipe],
  templateUrl: './historial-tabla.html',
  styleUrl: './historial-tabla.scss',
})
export class HistorialTablaComponent {
  readonly inversiones = input<InversionConUsuario[]>([]);
  readonly cargando = input(false);
  readonly error = input<string | null>(null);
}
