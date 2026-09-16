import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signal-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- ✅ Angular Forms [signal] -->
    <div>
      <input type="text" [ngModel]="username()" (ngModelChange)="username.set($event)" placeholder="Username" />
      <p>Hello, {{ formattedName() }}</p>
    </div>
  `
})
// ✅ Angular Forms [signal]
export class SignalFormComponent {
  username = signal('');
  formattedName = computed(() => this.username().toUpperCase());
}
