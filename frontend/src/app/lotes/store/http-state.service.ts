import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpStateService {
  private loadingCounter = 0;
  private readonly _isLoading = signal(false);
  private readonly _hasError = signal(false);

  readonly isLoading = this._isLoading;
  readonly hasError = this._hasError;

  incrementLoading(): void {
    this.loadingCounter += 1;
    this._isLoading.set(true);
  }

  decrementLoading(): void {
    this.loadingCounter = Math.max(0, this.loadingCounter - 1);
    if (this.loadingCounter === 0) {
      this._isLoading.set(false);
    }
  }

  clearError(): void {
    this._hasError.set(false);
  }

  reportError(): void {
    this._hasError.set(true);
  }
}
