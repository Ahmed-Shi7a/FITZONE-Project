import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-members',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-members.component.html'
})
export class AdminMembersComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  members = signal<any[]>([]);
  classes = signal<any[]>([]);
  selectedMember = signal<any | null>(null);


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      users: this.http.get<any>('http://localhost:5000/api/v1/users'),
      classes: this.http.get<any>('http://localhost:5000/api/v1/classes')
    }).subscribe({
      next: (res) => {
        if (res.users.success) {
          this.members.set(res.users.data.filter((u: any) => u.role === 'member'));
        }
        if (res.classes.success) {
          this.classes.set(res.classes.data);
        }
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.toast.show('Failed to load members.', 'error');
      }
    });
  }

  getPlanName(member: any): string {
    return member.membership?.name || '—';
  }

  getTrainerName(member: any): string {
    return member.trainerId?.name || '—';
  }

  getMemberClasses(uid: string): any[] {
    return this.classes().filter(c => c.bookedMemberIds?.includes(uid));
  }

  viewDetails(u: any) {
    this.selectedMember.set(u);
  }
  
  closeDetails() {
    this.selectedMember.set(null);
  }

  deleteMember(u: any) {
    if (!confirm(`Remove ${u.name} from FITZONE?`)) return;
    this.http.delete(`http://localhost:5000/api/v1/users/${u._id}`)
      .subscribe({
        next: () => {
          this.members.update(m => m.filter(x => x._id !== u._id));
          this.toast.show(`${u.name} removed.`, 'success');
        },
        error: (err) => {
          console.error(err);
          this.toast.show('Failed to delete member.', 'error');
        }
      });
  }
}
