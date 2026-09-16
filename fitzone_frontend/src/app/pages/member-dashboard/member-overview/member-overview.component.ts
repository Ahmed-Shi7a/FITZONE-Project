import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { GymClass } from '../../../interfaces/class-interface';

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

@Component({
  selector: 'app-member-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-overview.component.html'
})
export class MemberOverviewComponent implements OnInit {
  auth = inject(AuthService);
  data = inject(DataService);
  private toast = inject(ToastService);
  private http = inject(HttpClient);

  showQrCode = signal(false);

  currentPlan = computed(() => {
    const user = this.auth.currentUser() as any;
    if (user && user.membership && user.membership.name) {
      return user.membership;
    }
    return null;
  });

  selectedTrainer = computed(() => {
    const user = this.auth.currentUser() as any;
    const trainerObj = user?.trainerId;
    if (!trainerObj) return null;
    if (typeof trainerObj === 'object' && trainerObj.name) {
      // Mock the initials if not provided by backend
      const initials = trainerObj.name.split(/\s+/).map((p: string) => p[0]?.toUpperCase()).slice(0, 2).join('');
      return { ...trainerObj, initials };
    }
    return null;
  });

  myBookings = signal<any[]>([]);

  ngOnInit() {
    this.loadMyBookings();
  }


  loadMyBookings() {
    this.http.get<any>('http://localhost:5000/api/v1/users/my-classes')
      .subscribe({
        next: (res) => {
          if (res.success) {
            const sortedClasses = res.data.sort((a: any, b: any) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
            this.myBookings.set(sortedClasses);
          }
        },
        error: () => this.toast.show('Failed to load booked classes', 'error')
      });
  }

  totalWorkouts = computed(() => this.myBookings().length * 4);
  caloriesBurned = computed(() => this.myBookings().length * 650);

  toggleQrCode() {
    this.showQrCode.update(v => !v);
  }

  cancel(gymClass: any) {
    this.http.post<any>(`http://localhost:5000/api/v1/classes/${gymClass._id}/cancel`, {})
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.myBookings.update(arr => arr.filter(c => c._id !== gymClass._id));
            this.toast.show('Booking cancelled.', 'success');
          }
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to cancel booking.', 'error');
        }
      });
  }
}