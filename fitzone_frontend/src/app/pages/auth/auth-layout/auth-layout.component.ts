import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink],
  template: `
  <div class="min-h-screen grid md:grid-cols-2 bg-bg-deep">
    <!-- Left: brand banner -->
    <div class="relative hidden md:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#1a1f2c] via-[#12151c] to-[#090a0f]">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,87,34,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(41,121,255,0.25),transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center opacity-25"></div>

      <a routerLink="/home" class="relative font-display text-3xl font-bold z-10">FIT<span class="text-gradient">ZONE</span></a>

      <div class="relative z-10">
        <h2 class="font-display text-4xl font-bold leading-tight mb-4">{{ headline }}</h2>
        <p class="text-white/60 max-w-sm">{{ subline }}</p>
      </div>

      <div class="relative z-10 text-white/30 text-xs">&copy; 2026 FITZONE. Discipline. Power. Progress.</div>
    </div>

    <!-- Right: auth card -->
    <div class="flex items-center justify-center p-6 md:p-12 relative">
      <div class="md:hidden absolute top-6 left-6 font-display text-2xl font-bold">
        <a routerLink="/home">FIT<span class="text-gradient">ZONE</span></a>
      </div>
      <div class="w-full max-w-md animate-fade-up">
        <ng-content></ng-content>
      </div>
    </div>
  </div>
  `
})
export class AuthLayoutComponent {
  @Input() headline = 'TRAIN. TRACK. TRANSFORM.';
  @Input() subline = 'Access your personalized dashboard, book classes, and track your progress in real time.';
}
