export type EstadoInversion = 'activa' | 'vencida' | 'cancelada';

export interface SimularRequest {
  monto: number;
  plazoMeses: number;
}

export interface ResultadoSimulacion {
  monto: number;
  plazoMeses: number;
  tasaAplicada: number;
  gananciaEstimada: number;
  montoTotal: number;
}

export interface CrearInversionRequest {
  usuarioId: string | number;
  monto: number;
  plazoMeses: number;
}

export interface Inversion {
  id: string;
  usuarioId: string;
  monto: number;
  plazoMeses: number;
  tasaAnual: number;
  ganancia: number;
  montoFinal: number;
  estado: EstadoInversion;
  creadaEn: string;
}

export interface InversionConUsuario extends Inversion {
  usuario: {
    id: string;
    nombre: string;
    email: string;
  };
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T;
}

export interface FormSimulacionValue {
  monto: number | null;
  plazoMeses: number | null;
}
