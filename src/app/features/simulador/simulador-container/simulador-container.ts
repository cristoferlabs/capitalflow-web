import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  finalize,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { InversionesService } from '../../../core/services/inversiones';
import {
  InversionConUsuario,
  ResultadoSimulacion,
} from '../../../core/models/inversion.model';
import { SimuladorFormComponent } from '../simulador-form/simulador-form';
import { HistorialTablaComponent } from '../historial-tabla/historial-tabla';

/** Usuario seed por defecto (Ana Pérez). */
const USUARIO_DEFAULT = '1';

@Component({
  selector: 'app-simulador-container',
  imports: [ReactiveFormsModule, SimuladorFormComponent, HistorialTablaComponent],
  templateUrl: './simulador-container.html',
  styleUrl: './simulador-container.scss',
})
export class SimuladorContainerComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly inversionesService = inject(InversionesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    monto: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(100)],
    }),
    plazoMeses: this.fb.nonNullable.control(12, {
      validators: [Validators.required, Validators.min(1), Validators.max(24)],
    }),
  });

  readonly simulacion = signal<ResultadoSimulacion | null>(null);
  readonly cargandoSimulacion = signal(false);
  readonly errorSimulacion = signal<string | null>(null);

  readonly historial = signal<InversionConUsuario[]>([]);
  readonly cargandoHistorial = signal(false);
  readonly errorHistorial = signal<string | null>(null);

  readonly registrando = signal(false);
  readonly mensajeExito = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarHistorial();
    this.escucharSimulacionAutomatica();
  }

  onSimular(): void {
    this.ejecutarSimulacion();
  }

  onRegistrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { monto, plazoMeses } = this.form.getRawValue();
    if (monto == null) return;

    this.registrando.set(true);
    this.mensajeExito.set(null);

    this.inversionesService
      .registrar({
        usuarioId: USUARIO_DEFAULT,
        monto: Number(monto),
        plazoMeses: Number(plazoMeses),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.registrando.set(false))
      )
      .subscribe({
        next: () => {
          this.mensajeExito.set('Inversión registrada correctamente.');
          this.cargarHistorial();
        },
        error: (err) => {
          this.errorSimulacion.set(
            this.extraerMensaje(err, 'No se pudo registrar la inversión.')
          );
        },
      });
  }

  private escucharSimulacionAutomatica(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(
          (a, b) =>
            Number(a.monto) === Number(b.monto) &&
            Number(a.plazoMeses) === Number(b.plazoMeses)
        ),
        tap(() => {
          this.mensajeExito.set(null);
          this.errorSimulacion.set(null);
        }),
        switchMap(() => this.crearRequestSimulacion()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((resultado) => {
        if (resultado) {
          this.simulacion.set(resultado);
        }
      });

    this.form.updateValueAndValidity({ emitEvent: true });
  }

  private ejecutarSimulacion(): void {
    this.mensajeExito.set(null);
    this.errorSimulacion.set(null);

    this.crearRequestSimulacion()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((resultado) => {
        if (resultado) {
          this.simulacion.set(resultado);
        }
      });
  }

  private crearRequestSimulacion() {
    if (this.form.invalid) {
      this.simulacion.set(null);
      this.cargandoSimulacion.set(false);
      return EMPTY;
    }

    const { monto, plazoMeses } = this.form.getRawValue();
    this.cargandoSimulacion.set(true);

    return this.inversionesService
      .simular({
        monto: Number(monto),
        plazoMeses: Number(plazoMeses),
      })
      .pipe(
        catchError((err) => {
          this.errorSimulacion.set(
            this.extraerMensaje(err, 'Error al simular la inversión.')
          );
          this.simulacion.set(null);
          return of(null);
        }),
        finalize(() => this.cargandoSimulacion.set(false))
      );
  }

  private cargarHistorial(): void {
    this.cargandoHistorial.set(true);
    this.errorHistorial.set(null);

    this.inversionesService
      .listarPorUsuario(USUARIO_DEFAULT)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.errorHistorial.set(
            this.extraerMensaje(err, 'No se pudo cargar el historial.')
          );
          return EMPTY;
        }),
        finalize(() => this.cargandoHistorial.set(false))
      )
      .subscribe((data) => this.historial.set(data));
  }

  private extraerMensaje(err: unknown, fallback: string): string {
    const e = err as { error?: { error?: { message?: string }; message?: string }; message?: string };
    return e?.error?.error?.message ?? e?.error?.message ?? e?.message ?? fallback;
  }
}
