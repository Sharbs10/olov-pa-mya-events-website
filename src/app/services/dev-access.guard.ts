import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DevAccessService } from './dev-access.service';

export const devAccessGuard: CanActivateFn = () => {
  const access = inject(DevAccessService);
  const router = inject(Router);
  return access.isAuthorized ? true : router.createUrlTree(['/dev']);
};
