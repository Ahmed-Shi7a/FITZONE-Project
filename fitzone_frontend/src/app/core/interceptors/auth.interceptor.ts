import { HttpInterceptorFn } from '@angular/common/http';

// ✅ Interceptors (error - auth)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('fitzone_token');
  
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  
  return next(req);
};
