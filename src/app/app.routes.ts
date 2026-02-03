import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
    { path: 'signup', loadComponent: () => import('./components/signup/signup').then(m => m.Signup) }
];
