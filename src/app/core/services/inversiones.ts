import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  ApiListResponse,
  CrearInversionRequest,
  Inversion,
  InversionConUsuario,
  ResultadoSimulacion,
  SimularRequest,
} from '../models/inversion.model';

@Injectable({
  providedIn: 'root',
})
export class InversionesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1/inversiones';

  simular(payload: SimularRequest): Observable<ResultadoSimulacion> {
    return this.http.post<ResultadoSimulacion>(`${this.baseUrl}/simular`, payload);
  }

  registrar(payload: CrearInversionRequest): Observable<Inversion> {
    return this.http
      .post<ApiListResponse<Inversion>>(this.baseUrl, payload)
      .pipe(map((res) => res.data));
  }

  listarPorUsuario(usuarioId: string | number): Observable<InversionConUsuario[]> {
    return this.http
      .get<ApiListResponse<InversionConUsuario[]>>(
        `${this.baseUrl}/usuario/${usuarioId}`
      )
      .pipe(map((res) => res.data));
  }

  listar(): Observable<Inversion[]> {
    return this.http
      .get<ApiListResponse<Inversion[]>>(this.baseUrl)
      .pipe(map((res) => res.data));
  }
}
