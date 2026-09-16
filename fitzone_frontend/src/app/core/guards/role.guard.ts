import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../interfaces/user-interface';

// ✅ Routing (Route Guard)
export function roleGuard(requiredRole: UserRole): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      // ✅ Routing (define routes- navigating using router link and router service navigate by url or navigate function)
      router.navigate(['/signin']);
      return false;
    }
    if (auth.role() !== requiredRole) {
      const redirect = auth.role() === 'admin' ? '/admin-dashboard' : '/member-dashboard';
      router.navigate([redirect]);
      return false;
    }
    return true;
  };
}
