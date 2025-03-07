import { Routes } from '@angular/router';
import { SignInComponent } from './views/pages/auth/sign-in/sign-in.component';
import { HomeLayoutComponent } from './views/partials/home-layout/home-layout.component';
import { DashboardComponent } from './views/pages/dashboard/dashboard.component';
import { CreateCardComponent } from './views/pages/create-card/create-card.component';
import { UsersComponent } from './views/pages/users/users.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: SignInComponent },
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [authGuard], // Yahan guard add karo
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-card', component: CreateCardComponent },
      { path: 'users', component: UsersComponent }
    ],
  },
];
