import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
  <footer class="border-t border-white/5 bg-bg-panel mt-20">
    <div class="section-container py-10 grid gap-8 md:grid-cols-3">
      <div>
        <div class="font-display text-2xl font-bold mb-2">FIT<span class="text-gradient">ZONE</span></div>
        <p class="text-white/50 text-sm max-w-xs">Premium strength & performance training. Built for athletes, powered by discipline.</p>
      </div>
      <div class="flex gap-10">
        <div>
          <h4 class="font-display font-semibold mb-2 text-sm uppercase tracking-wide text-white/70">Explore</h4>
          <ul class="text-sm text-white/50 space-y-1">
            <li><a routerLink="/home" class="hover:text-neon-orange-light">Home</a></li>
            <li><a routerLink="/signin" class="hover:text-neon-orange-light">Sign In</a></li>
            <li><a routerLink="/signup" class="hover:text-neon-orange-light">Join Now</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-display font-semibold mb-2 text-sm uppercase tracking-wide text-white/70">Contact</h4>
          <ul class="text-sm text-white/50 space-y-1">
            <li>Haram, Giza, Egypt</li>
            <li>hello&#64;fitzone.com</li>
          </ul>
        </div>
      </div>
      <div class="text-sm text-white/40 md:text-right self-end">
        &copy; 2026 FITZONE. Graduation Project Demo.
      </div>
    </div>
  </footer>
  `
})
export class FooterComponent {}
