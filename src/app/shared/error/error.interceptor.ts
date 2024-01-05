import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError, finalize } from 'rxjs';
import { LoadingService } from '../loading/loading.service';
import { NotificationService } from '../notification/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  let notificationService = inject(NotificationService);
  let loadingService = inject(LoadingService);
  loadingService.showLoading();

  return next(req).pipe(
    finalize(() => {
      loadingService.hideLoading();
    }),
    catchError((error: HttpErrorResponse) => {
      loadingService.hideLoading();
      notificationService.open(error.message);
      return EMPTY;
    })
  );
};
