import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-up">
      <div class="text-center mb-8">
        <span class="badge-blue">Membership Upgrade</span>
        <h2 class="font-display text-3xl font-bold mt-2">Available Plans</h2>
        <p class="text-white/50 text-sm mt-1">Upgrade or switch your active gym membership plan instantly.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        @for (plan of plans(); track plan._id) {
          <div class="glow-card p-7 flex flex-col justify-between" [class.border-neon-orange]="plan._id === getMembershipId(auth.currentUser())">
            <div>
              @if (plan._id === getMembershipId(auth.currentUser())) {
                <span class="badge-neon mb-4 inline-block">Current Plan</span>
              }
              <h3 class="font-display text-2xl font-bold">{{ plan.name }}</h3>
              <p class="text-white/50 text-sm mb-4">{{ plan.tagline }}</p>
              <div class="text-4xl font-bold font-display mb-5">
                {{ plan.price }} <span class="text-base text-white/40 font-normal">EGP / {{ plan.billingCycle }}</span>
              </div>
              <ul class="space-y-2 text-sm text-white/70 mb-8">
                @for (f of plan.features; track f) {
                  <li class="flex items-start gap-2">
                    <span class="text-neon-orange-light">&#10003;</span> {{ f }}
                  </li>
                }
              </ul>
            </div>
            
            <button 
              (click)="selectPlan(plan._id)" 
              [ngClass]="plan._id === getMembershipId(auth.currentUser()) ? 'bg-white/10 text-red-400 border border-red-500/50 hover:bg-red-500/20' : 'bg-neon-orange text-white hover:bg-neon-orange/85'"
              class="w-full py-3 rounded-xl font-display text-sm font-bold uppercase tracking-wider transition-all cursor-pointer">
              {{ plan._id === getMembershipId(auth.currentUser()) ? 'Cancel Plan' : 'Select Plan' }}
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class PlansComponent implements OnInit {
  private http = inject(HttpClient);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  private plansApiUrl = 'http://localhost:5000/api/v1/memberships';
  private userApiUrl = 'http://localhost:5000/api/v1/users/me';

  plans = signal<any[]>([]);

  ngOnInit() {
    this.loadPlans();
  }


  loadPlans() {
    this.http.get<any>(this.plansApiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.plans.set(res.data);
        }
      },
      error: () => this.toast.show('Failed to load plans.', 'error')
    });
  }

  getMembershipId(user: any): string | null {
    if (!user || !user.membership) return null;
    return typeof user.membership === 'object' ? user.membership._id : user.membership;
  }

  selectPlan(planId: string) {
    const user = this.auth.currentUser();
    if (user) {
      const isCancel = this.getMembershipId(user) === planId;
      const payload = { membership: isCancel ? null : planId };
      this.http.patch<any>(this.userApiUrl, payload)
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.auth.updateUser({ membership: isCancel ? undefined : (res.data.membership || planId) });
              const msg = isCancel 
                ? 'Membership plan cancelled successfully.' 
                : 'Membership plan updated successfully!';
              this.toast.show(msg, 'success');
            }
          },
          error: (err) => {
            this.toast.show(err.error?.message || 'Failed to update plan.', 'error');
          }
        });
    }
  }
}