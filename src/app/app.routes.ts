import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin/users/:id',
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () =>
      import('./features/admin/admin-user-details.component').then((m) => m.AdminUserDetailsComponent),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () =>
      import('./features/admin/admin-users.component').then((m) => m.AdminUsersComponent),
  },
  {
    path: 'admin/cars',
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () => import('./features/admin/admin-cars.component').then((m) => m.AdminCarsComponent),
  },
  {
    path: 'admin/orders',
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () =>
      import('./features/admin/admin-orders.component').then((m) => m.AdminOrdersComponent),
  },
  {
    path: 'admin/order/:id',
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () =>
      import('./features/admin/admin-order-details.component').then((m) => m.AdminOrderDetailsComponent),
  },
  {
    path: 'cars',
    canActivate: [authGuard, roleGuard('customer')],
    loadComponent: () =>
      import('./features/customer/customer-cars.component').then((m) => m.CustomerCarsComponent),
  },
  {
    path: 'cars/:id',
    canActivate: [authGuard, roleGuard('customer')],
    loadComponent: () =>
      import('./features/customer/customer-car-details.component').then(
        (m) => m.CustomerCarDetailsComponent,
      ),
  },
  {
    path: 'orders',
    canActivate: [authGuard, roleGuard('customer')],
    loadComponent: () =>
      import('./features/customer/customer-orders.component').then((m) => m.CustomerOrdersComponent),
  },
  {
    path: 'orders/:id',
    canActivate: [authGuard, roleGuard('customer')],
    loadComponent: () =>
      import('./features/customer/customer-order-details.component').then(
        (m) => m.CustomerOrderDetailsComponent,
      ),
  },
  {
    path: 'installments',
    canActivate: [authGuard, roleGuard('customer')],
    loadComponent: () =>
      import('./features/customer/customer-installments.component').then(
        (m) => m.CustomerInstallmentsComponent,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
