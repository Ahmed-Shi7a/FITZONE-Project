import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if (open) {
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up" (click)="onBackdrop($event)">
      <div class="glow-card w-full max-w-lg p-6 relative" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-display text-xl font-bold">{{ title }}</h3>
          <button class="text-white/50 hover:text-neon-orange-light text-xl leading-none" (click)="close.emit()" aria-label="Close">&times;</button>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  }
  `
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();

  onBackdrop(e: MouseEvent) {
    e.stopPropagation();
    this.close.emit();
  }
}
