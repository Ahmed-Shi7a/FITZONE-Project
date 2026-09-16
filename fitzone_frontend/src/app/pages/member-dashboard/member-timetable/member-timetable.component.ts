import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { DAYS_OF_WEEK } from '../../../constants/gym-constants';

const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

@Component({
  selector: 'app-member-timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-timetable.component.html'
})
export class MemberTimetableComponent implements OnInit {
  auth = inject(AuthService);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private apiUrl = 'http://localhost:5000/api/v1/classes';

  days = ['All', ...DAYS_OF_WEEK];
  activeDayFilter = signal<string>('All');
  classes = signal<any[]>([]);

  ngOnInit() {
    this.loadClasses();
  }


  loadClasses() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success) {
          this.classes.set(res.data);
        }
      },
      error: () => this.toast.show('Failed to load classes.', 'error')
    });
  }

  filteredClasses = computed(() => {
    const filter = this.activeDayFilter();
    const list = this.classes();
    return (filter === 'All' ? list : list.filter((c) => c.day === filter))
      .slice()
      .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || (a.time || '').localeCompare(b.time || ''));
  });

  isBooked(gymClass: any): boolean {
    const uid = this.auth.currentUser()?.id; // ID here might be _id in the token, but auth service maps it to id or we can check both
    // Need to handle if currentUser has id or _id
    const actualUid = (this.auth.currentUser() as any)?._id || this.auth.currentUser()?.id;
    return !!actualUid && gymClass.bookedMemberIds?.includes(actualUid);
  }

  spotsLeft(gymClass: any): number {
    return gymClass.capacity - (gymClass.bookedMemberIds?.length || 0);
  }

  getTrainerName(trainerVal: any): string {
    if (!trainerVal) return 'Unknown';
    if (typeof trainerVal === 'object' && trainerVal.name) return trainerVal.name;
    return 'Unknown';
  }

  book(gymClass: any) {
    this.http.post<any>(`${this.apiUrl}/${gymClass._id}/book`, {})
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.classes.update(arr => arr.map(c => c._id === gymClass._id ? res.data : c));
            this.toast.show('Class booked successfully!', 'success');
          }
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to book class.', 'error');
        }
      });
  }

  cancel(gymClass: any) {
    this.http.post<any>(`${this.apiUrl}/${gymClass._id}/cancel`, {})
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.classes.update(arr => arr.map(c => c._id === gymClass._id ? res.data : c));
            this.toast.show('Booking cancelled.', 'success');
          }
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to cancel booking.', 'error');
        }
      });
  }
}
