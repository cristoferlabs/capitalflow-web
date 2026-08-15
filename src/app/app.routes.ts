import { Routes } from '@angular/router';
import { SimuladorContainerComponent } from './features/simulador/simulador-container/simulador-container';

export const routes: Routes = [
  { path: '', component: SimuladorContainerComponent },
  { path: '**', redirectTo: '' },
];
