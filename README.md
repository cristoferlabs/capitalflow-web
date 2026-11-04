# CapitalFlow Web

Frontend en **Angular** para simular y registrar micro-inversiones. La simulación se recalcula en vivo mientras el usuario escribe, con un flujo **RxJS** que evita peticiones redundantes, y el flujo principal está cubierto con pruebas **E2E en Cypress**.

Parte de **CapitalFlow**: [capitalflow-api](https://github.com/cristoferlabs/capitalflow-api) (API REST).

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Cypress](https://img.shields.io/badge/E2E-Cypress-69D3A7?logo=cypress&logoColor=white)

## Arquitectura

Patrón **Smart / Dumb**: un contenedor orquesta estado y llamadas HTTP; los componentes de presentación solo reciben inputs y emiten eventos.

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `SimuladorContainerComponent` | Smart | Estado, llamadas HTTP y orquestación RxJS |
| `SimuladorFormComponent` | Dumb | Formulario reactivo y tarjeta de resultado |
| `HistorialTablaComponent` | Dumb | Historial con control flow `@for` / `@if` y `currency:'PEN'` |
| `InversionesService` | Servicio | Cliente HTTP centralizado del API |

### Simulación en vivo

```
valueChanges → debounceTime(400) → distinctUntilChanged → switchMap(simular) → catchError
```

`switchMap` cancela la petición anterior si el usuario sigue escribiendo, así la tarjeta siempre muestra el resultado del último valor.

## Ejecución local

Requisitos: Node.js 20+ y [capitalflow-api](https://github.com/cristoferlabs/capitalflow-api) corriendo en `http://localhost:3000`.

```bash
npm install
npm start                      # http://localhost:4200
```

## Pruebas

```bash
npm test                       # unitarias (Vitest)
npm run e2e                    # E2E headless (Cypress, requiere npm start)
npm run e2e:open               # Cypress interactivo
```

`cypress/e2e/simulacion.cy.ts` ingresa S/ 2,000 a 12 meses y verifica la tasa (10 %), la ganancia (S/ 200.00) y el monto final (S/ 2,200.00).
