import { Injectable, computed, signal, inject } from '@angular/core';
import { AppUser, UserRole } from '../../interfaces/user-interface';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

const SESSION_KEY = 'fitzone_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private data = inject(DataService);
  private http = inject(HttpClient);
  private router = inject(Router);
  // ✅ Signals
  private currentUserSig = signal<AppUser | null>(this.restoreSession());
  private apiUrl = 'http://localhost:5000/api/v1/users';

  readonly currentUser = this.currentUserSig.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSig() !== null);
  readonly role = computed<UserRole | null>(() => this.currentUserSig()?.role ?? null);

  private restoreSession(): AppUser | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const sessionUser = JSON.parse(raw) as AppUser;

      const latestUser = this.data.users().find(u => u.id === sessionUser.id);
      return latestUser || sessionUser;
    } catch {
      return null;
    }
  }

  private persistSession(user: AppUser | null) {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }

  updateUser(updatedData: Partial<AppUser>) {
    const current = this.currentUserSig();
    if (current) {
      const updated: AppUser = { ...current, ...updatedData };

      this.currentUserSig.set(updated);
      this.persistSession(updated);

      this.data.updateUser(updated.id, updatedData);
    }
  }

  signIn(email: string, password: string): Observable<{ ok: boolean; message: string }> {
    // ✅ Connect frontend with backend
    // ✅ HttpClient
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response.success && response.data) {
          const user = response.data as AppUser;
          
          if (response.token) {
            localStorage.setItem('fitzone_token', response.token);
            try {
              const decoded = jwtDecode<any>(response.token);
              if (decoded.role) {
                user.role = decoded.role;
              }
            } catch (err) {
              console.error('Invalid token format');
            }
          }

          this.currentUserSig.set(user);
          this.persistSession(user);

          // Automatically redirect based on role
          this.router.navigate([user.role === 'admin' ? '/admin-dashboard' : '/member-dashboard']);

          return { ok: true, message: 'Signed in successfully.' };
        }
        return { ok: false, message: 'Invalid response from server.' };
      }),
      catchError(error => {
        const msg = error.error?.message || 'Login failed. Please try again.';
        return of({ ok: false, message: msg });
      })
    );
  }

  signUp(name: string, email: string, password: string): Observable<{ ok: boolean; message: string }> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      map(response => {
        if (response.success) {
          return { ok: true, message: 'Account created successfully. Please login.' };
        }
        return { ok: false, message: 'Failed to create account.' };
      }),
      catchError(error => {
        const msg = error.error?.message || 'Registration failed. Please try again.';
        return of({ ok: false, message: msg });
      })
    );
  }

  signOut() {
    this.currentUserSig.set(null);
    this.persistSession(null);
    localStorage.removeItem('fitzone_token');
  }
}