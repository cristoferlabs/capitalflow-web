# Frontend Micro-Inversiones

Interfaz Angular (Smart/Dumb) + RxJS para simular y registrar micro-inversiones contra el API del backend.

## Requisitos

- Backend corriendo en `http://localhost:3000`
- Node.js 20+

## Arranque

```bash
npm install
npm start
```

App: `http://localhost:4200`

## Arquitectura

| Componente | Rol |
|------------|-----|
| `SimuladorContainerComponent` | Smart: HTTP, estado, orquestación RxJS |
| `SimuladorFormComponent` | Dumb: formulario reactivo + tarjeta de resumen |
| `HistorialTablaComponent` | Dumb: tabla con `@for` / `@if` y `currency:'PEN'` |
| `InversionesService` | Cliente HTTP centralizado |

### Simulación automática (RxJS)

`valueChanges` → `debounceTime(400)` → `distinctUntilChanged` → `switchMap` → `catchError`

## Usuario por defecto

Registra e historial usan el usuario seed `1` (Ana Pérez).

## Cypress (E2E)

```bash
# Terminal 1: frontend
npm start

# Terminal 2: pruebas
npm run e2e        # headless
npm run e2e:open   # UI interactiva
```

Spec: `cypress/e2e/simulacion.cy.ts`  
Valida monto, plazo 12 meses y tarjeta `.tarjeta-resultado` (10%, S/ 200.00, S/ 2,200.00).
