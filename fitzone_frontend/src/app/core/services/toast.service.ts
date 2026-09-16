import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal('');
  type = signal<'success' | 'error'>('success');

  show(message: string, type: 'success' | 'error' = 'success') {
    this.type.set(type);
    this.message.set(message);
    setTimeout(() => this.message.set(''), 2500);
  }
}
