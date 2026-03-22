import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Expecting the routes to pass expectedRole in data
  const expectedRoles: string[] = route.data['expectedRoles'];
  const user = authService.currentUserValue;

  if (user && expectedRoles.includes(user.role)) {
    return true;
  }

  // Not authorized -> Redirect
  return router.parseUrl('/profile');
};
