import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-trainers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './admin-trainers.component.html'
})
export class AdminTrainersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  modalOpen = signal(false);
  editingId = signal<string | null>(null);
  selectedTrainer = signal<any | null>(null);

  trainers = signal<any[]>([]);
  users = signal<any[]>([]);


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      trainers: this.http.get<any>('http://localhost:5000/api/v1/trainers'),
      users: this.http.get<any>('http://localhost:5000/api/v1/users')
    }).subscribe({
      next: (res) => {
        if (res.trainers.success) this.trainers.set(res.trainers.data);
        if (res.users.success) this.users.set(res.users.data.filter((u: any) => u.role === 'member'));
      },
      error: (err) => {
        console.error('Error loading trainers', err);
        this.toast.show('Failed to load trainers.', 'error');
      }
    });
  }

  form = this.fb.group({
    name: ['', Validators.required],
    specialty: ['', Validators.required],
    experienceYears: [1, [Validators.required, Validators.min(0)]],
    bio: ['', Validators.required]
  });

  openModal(trainer?: any) {
    this.modalOpen.set(true);
    this.editingId.set(trainer?._id ?? null);
    this.form.reset(
      trainer
        ? { name: trainer.name, specialty: trainer.specialty, experienceYears: trainer.experience || trainer.experienceYears, bio: trainer.bio }
        : { name: '', specialty: '', experienceYears: 1, bio: '' }
    );
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name.trim().split(/\s+/).map((p) => p[0]?.toUpperCase()).slice(0, 2).join('');
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload = { name: v.name!, specialty: v.specialty!, experience: v.experienceYears!, experienceYears: v.experienceYears!, bio: v.bio! };
    const id = this.editingId();
    
    if (id) {
      this.http.patch<any>(`http://localhost:5000/api/v1/trainers/${id}`, payload)
        .subscribe({
          next: (res) => {
            this.trainers.update(ts => ts.map(t => t._id === id ? res.data : t));
            this.toast.show('Trainer updated.', 'success');
            this.close();
          },
          error: () => this.toast.show('Failed to update trainer.', 'error')
        });
    } else {
      this.http.post<any>('http://localhost:5000/api/v1/trainers', payload)
        .subscribe({
          next: (res) => {
            this.trainers.update(ts => [...ts, res.data]);
            this.toast.show('Trainer added.', 'success');
            this.close();
          },
          error: () => this.toast.show('Failed to add trainer.', 'error')
        });
    }
  }

  delete(t: any) {
    if (!confirm(`Remove trainer ${t.name}?`)) return;
    this.http.delete(`http://localhost:5000/api/v1/trainers/${t._id}`)
      .subscribe({
        next: () => {
          this.trainers.update(ts => ts.filter(x => x._id !== t._id));
          this.toast.show('Trainer removed.', 'success');
        },
        error: () => this.toast.show('Failed to remove trainer.', 'error')
      });
  }

  close() {
    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  getTrainerMembers(trainerId: string): any[] {
    return this.users().filter((u) => u.trainerId?._id === trainerId || u.trainerId === trainerId);
  }

  viewDetails(t: any) {
    this.selectedTrainer.set(t);
  }

  closeDetails() {
    this.selectedTrainer.set(null);
  }
}
