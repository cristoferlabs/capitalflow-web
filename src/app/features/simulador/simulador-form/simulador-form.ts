import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { ResultadoSimulacion } from '../../../core/models/inversion.model';

@Component({
  selector: 'app-simulador-form',
  imports: [ReactiveFormsModule, DecimalPipe, PercentPipe],
  templateUrl: './simulador-form.html',
  styleUrl: './simulador-form.scss',
})
export class SimuladorFormComponent {
  readonly form = input.required<FormGroup>();
  readonly simulacion = input<ResultadoSimulacion | null>(null);
  readonly cargando = input(false);
  readonly errorSimulacion = input<string | null>(null);
  readonly registrando = input(false);

  readonly simular = output<void>();
  readonly registrar = output<void>();

  readonly plazos = Array.from({ length: 24 }, (_, i) => i + 1);

  get montoCtrl() {
    return this.form().get('monto');
  }

  get plazoCtrl() {
    return this.form().get('plazoMeses');
  }

  onSubmit(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    this.simular.emit();
  }

  onRegistrar(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    this.registrar.emit();
  }
}
