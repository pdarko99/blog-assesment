import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loaderSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loaderSubject.asObservable();

  showLoading() {
    this.loaderSubject.next(true);
  }
  hideLoading() {
    this.loaderSubject.next(false);
  }
}
