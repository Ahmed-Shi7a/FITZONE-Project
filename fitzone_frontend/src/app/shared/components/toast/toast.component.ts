import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if (toast.message()) {
    <div class="fixed bottom-6 right-6 z-[60] animate-fade-up">
      <div
        [class]="'px-5 py-3 rounded-xl border font-medium shadow-glow text-sm ' + (toast.type() === 'success' ? 'bg-green-500/15 border-green-500/40 text-green-300' : 'bg-red-500/15 border-red-500/40 text-red-300')"
      >
        {{ toast.message() }}
      </div>
    </div>
  }
  `
})
export class ToastComponent {
  toast = inject(ToastService);
}
