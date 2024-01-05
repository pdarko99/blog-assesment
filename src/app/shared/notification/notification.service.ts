import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  snackBar = inject(MatSnackBar);

  constructor() {}

  open(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }
}
