import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // if no token is found, user is not authenticated and is redirected to login
    inject(Router).navigate(['admin/login'])
    return false;
  }
  return true;
};
