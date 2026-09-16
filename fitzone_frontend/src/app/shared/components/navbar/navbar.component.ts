import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
  <header class="sticky top-0 z-40 backdrop-blur bg-[#090a0fcc] border-b border-white/5">
    <nav class="section-container flex items-center justify-between h-16">
      <!-- Logo redirects based on auth state -->
      <a [routerLink]="auth.isAuthenticated() ? '/member-dashboard/overview' : '/home'" class="font-display text-2xl font-bold tracking-wide cursor-pointer">
        FIT<span class="text-gradient">ZONE</span>
      </a>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-white/80 text-2xl" (click)="menuOpen.set(!menuOpen())" aria-label="Toggle menu">
        &#9776;
      </button>

      <!-- Desktop Nav Links (Context Aware) -->
      <div class="hidden md:flex items-center gap-8 font-display text-sm tracking-wide uppercase">
        @if (!auth.isAuthenticated()) {
          <!-- Public Links for visitors -->
          <a (click)="scrollToSection('plans')" class="hover:text-neon-orange-light transition-colors cursor-pointer">Plans</a>
          <a (click)="scrollToSection('trainers')" class="hover:text-neon-orange-light transition-colors cursor-pointer">Trainers</a>
        } @else {
          <!-- Member portal badge instead of duplicate links -->
          <span class="text-xs tracking-wider text-neon-orange font-semibold bg-neon-orange/10 px-3 py-1 rounded-full border border-neon-orange/20">Member Portal</span>
        }
        
        @if (auth.role() === 'admin') {
          <a routerLink="/admin-dashboard" routerLinkActive="text-neon-orange-light" class="hover:text-neon-orange-light transition-colors">Admin Panel</a>
        }
      </div>

      <!-- Desktop Action Buttons -->
      <div class="hidden md:flex items-center gap-3">
        @if (!auth.isAuthenticated()) {
          <a routerLink="/signin" class="btn-outline-blue text-sm">Sign In</a>
          <a routerLink="/signup" class="btn-neon text-sm">Join Now</a>
        } @else {
          <span class="badge-neon">{{ auth.currentUser()?.role }}</span>
          <div class="w-9 h-9 rounded-full bg-bg-card border border-neon-orange/40 flex items-center justify-center text-sm font-bold text-white">
            {{ auth.currentUser()?.avatarInitials }}
          </div>
          <button class="btn-outline-blue text-sm cursor-pointer" (click)="logout()">Log Out</button>
        }
      </div>
    </nav>

    <!-- Mobile Dropdown Menu -->
    @if (menuOpen()) {
      <div class="md:hidden section-container pb-4 flex flex-col gap-3 border-t border-white/5 pt-3 animate-fade-up">
        @if (!auth.isAuthenticated()) {
          <a (click)="scrollToSection('plans'); menuOpen.set(false)" class="py-1 cursor-pointer">Plans</a>
          <a (click)="scrollToSection('trainers'); menuOpen.set(false)" class="py-1 cursor-pointer">Trainers</a>
        }

        @if (auth.role() === 'admin') {
          <a routerLink="/admin-dashboard" class="py-1" (click)="menuOpen.set(false)">Admin Panel</a>
        }
        
        @if (!auth.isAuthenticated()) {
          <a routerLink="/signin" class="btn-outline-blue text-center" (click)="menuOpen.set(false)">Sign In</a>
          <a routerLink="/signup" class="btn-neon text-center" (click)="menuOpen.set(false)">Join Now</a>
        } @else {
          <button class="btn-outline-blue" (click)="logout()">Log Out</button>
        }
      </div>
    }
  </header>
  `
})
export class NavbarComponent {
  menuOpen = signal(false);

  constructor(public auth: AuthService, private router: Router) { }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    }
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/home']);
  }
}