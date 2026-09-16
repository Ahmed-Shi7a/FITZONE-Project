import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../interfaces/user-interface';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './signin.component.html'
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  loading = signal(false);
  errorMsg = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  useDemo() {
    this.form.patchValue({ email: 'member@fitzone.com', password: 'member123' });
  }

  submit() {
    this.errorMsg.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();

    this.auth.signIn(email!, password!).subscribe({
      next: (result) => {
        this.loading.set(false);
        if (!result.ok) {
          this.errorMsg.set(result.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('An unexpected error occurred.');
      }
    });
  }
}
