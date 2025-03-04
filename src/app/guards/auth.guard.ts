import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AppStorage } from '../core/utilities/app-storage';
import { common } from '../core/constants/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(AppStorage);
  
  let token = storage.get(common.TOKEN); 

  if (token) {
    return true; 
  } else {
    router.navigate(['auth/login']); 
    return false;
  }
};
