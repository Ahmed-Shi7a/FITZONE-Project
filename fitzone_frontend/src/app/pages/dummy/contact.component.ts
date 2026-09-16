import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- ✅ Angular Forms [template driven] -->
    <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm.value)">
      <input type="text" name="message" ngModel placeholder="Message" />
      <button type="submit">Send</button>
    </form>
  `
})
export class ContactComponent {
  onSubmit(data: any) {
    console.log('Template driven form data:', data);
  }
}
