import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/api.models';

export function roleGuard(role: UserRole): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const hasRole = role === 'admin' ? auth.isAdmin() : auth.isCustomer();
    return hasRole ? true : router.parseUrl('/login');
  };
}
