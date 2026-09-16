import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-trainers',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6 animate-fade-up">
      <div class="text-center mb-8">
        <span class="badge-neon">Expert Guidance</span>
        <h2 class="font-display text-3xl font-bold mt-2">Our Elite Trainers</h2>
        <p class="text-white/50 text-sm mt-1">Book 1-on-1 personal training sessions with professional coaches.</p>
      </div>

      <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        @for (trainer of trainers(); track trainer._id) {
          <div class="glow-card p-6 text-center flex flex-col justify-between transition-all" 
               [class.border-neon-orange]="isTrainerSelected(trainer._id)">
            <div>
              @if (isTrainerSelected(trainer._id)) {
                <span class="badge-neon mb-3 inline-block">Your Trainer</span>
              }
              <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-neon-orange to-neon-blue flex items-center justify-center font-display font-bold text-xl mb-4 shadow-lg shadow-neon-orange/20 text-white">
                {{ trainer.initials }}
              </div>
              <h4 class="font-display font-bold text-lg text-white">{{ trainer.name }}</h4>
              <p class="text-neon-orange-light text-xs uppercase tracking-wide mb-3 font-semibold">{{ trainer.specialty }}</p>
              <p class="text-white/50 text-sm mb-4 leading-relaxed">{{ trainer.bio }}</p>
            </div>
            
            <div>
              <div class="mb-4 text-xs badge-blue inline-block">&#9733; {{ trainer.rating }} &middot; {{ trainer.experienceYears }}y exp</div>
              <button 
                type="button"
                (click)="bookTrainer(trainer._id, trainer.name)" 
                class="w-full py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                [ngClass]="isTrainerSelected(trainer._id) ? 'bg-white/10 text-red-400 border border-red-500/50 hover:bg-red-500/20' : 'bg-neon-orange text-white hover:bg-neon-orange/85'">
                {{ isTrainerSelected(trainer._id) ? 'Cancel Session' : 'Book Session' }}
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class TrainersComponent implements OnInit {
    private http = inject(HttpClient);
    auth = inject(AuthService);
    private toast = inject(ToastService);

    private trainersApiUrl = 'http://localhost:5000/api/v1/trainers';
    private userApiUrl = 'http://localhost:5000/api/v1/users/me';

    trainers = signal<any[]>([]);

    ngOnInit() {
        this.loadTrainers();
    }


    loadTrainers() {
        this.http.get<any>(this.trainersApiUrl).subscribe({
            next: (res) => {
                if (res.success) {
                    const mappedTrainers = res.data.map((t: any) => {
                        const initials = t.name?.split(/\\s+/).map((p: string) => p[0]?.toUpperCase()).slice(0, 2).join('') || 'TR';
                        return { ...t, initials };
                    });
                    this.trainers.set(mappedTrainers);
                }
            },
            error: () => this.toast.show('Failed to load trainers.', 'error')
        });
    }

    getTrainerId(user: any): string | null {
        if (!user || !user.trainerId) return null;
        return typeof user.trainerId === 'object' ? user.trainerId._id : user.trainerId;
    }

    isTrainerSelected(trainerId: string): boolean {
        const user = this.auth.currentUser();
        return this.getTrainerId(user) === trainerId;
    }

    bookTrainer(trainerId: string, trainerName: string) {
        const user = this.auth.currentUser();
        if (user) {
            const isCancel = this.isTrainerSelected(trainerId);
            const payload = { trainerId: isCancel ? null : trainerId };
            this.http.patch<any>(this.userApiUrl, payload)
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.auth.updateUser({ trainerId: isCancel ? undefined : (res.data.trainerId || trainerId) });
                            const msg = isCancel 
                                ? `Session with ${trainerName} cancelled.` 
                                : `Personal session booked with ${trainerName} successfully!`;
                            this.toast.show(msg, 'success');
                        }
                    },
                    error: (err) => {
                        this.toast.show(err.error?.message || 'Failed to update trainer booking.', 'error');
                    }
                });
        }
    }
}