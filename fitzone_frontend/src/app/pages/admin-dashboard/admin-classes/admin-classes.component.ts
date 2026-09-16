import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToastService } from '../../../core/services/toast.service';
import { DAYS_OF_WEEK, CLASS_CATEGORIES } from '../../../constants/gym-constants';

@Component({
  selector: 'app-admin-classes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './admin-classes.component.html'
})
export class AdminClassesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  days = DAYS_OF_WEEK;
  categories = CLASS_CATEGORIES;

  modalOpen = signal(false);
  editingId = signal<string | null>(null);
  selectedClass = signal<any | null>(null);

  classes = signal<any[]>([]);
  trainers = signal<any[]>([]);
  users = signal<any[]>([]);


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      classes: this.http.get<any>('http://localhost:5000/api/v1/classes'),
      trainers: this.http.get<any>('http://localhost:5000/api/v1/trainers'),
      users: this.http.get<any>('http://localhost:5000/api/v1/users')
    }).subscribe({
      next: (res) => {
        if (res.classes.success) this.classes.set(res.classes.data);
        if (res.trainers.success) this.trainers.set(res.trainers.data);
        if (res.users.success) this.users.set(res.users.data.filter((u: any) => u.role === 'member'));
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.toast.show('Failed to load data.', 'error');
      }
    });
  }

  form = this.fb.group({
    name: ['', Validators.required],
    trainerId: ['', Validators.required],
    day: ['Monday', Validators.required],
    startTime: ['07:00', Validators.required],
    durationMins: [45, [Validators.required, Validators.min(10)]],
    category: ['Strength', Validators.required],
    capacity: [16, [Validators.required, Validators.min(1)]],
    room: ['', Validators.required]
  });

  openModal(gymClass?: any) {
    this.modalOpen.set(true);
    this.editingId.set(gymClass?._id ?? null);
    
    // Support either populated trainer object or direct string ID
    const trainerVal = gymClass?.trainer?._id || gymClass?.trainer || gymClass?.trainerId || (this.trainers()[0]?._id ?? '');
    
    this.form.reset(
      gymClass
        ? { name: gymClass.name, trainerId: trainerVal, day: gymClass.day, startTime: gymClass.time || gymClass.startTime, durationMins: gymClass.durationMins, category: gymClass.category, capacity: gymClass.capacity, room: gymClass.room }
        : { name: '', trainerId: this.trainers()[0]?._id ?? '', day: 'Monday', startTime: '07:00', durationMins: 45, category: 'Strength', capacity: 16, room: '' }
    );
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload = {
      name: v.name!,
      trainer: v.trainerId!,
      day: v.day!,
      time: v.startTime!,
      durationMins: v.durationMins!,
      category: v.category!,
      capacity: v.capacity!,
      room: v.room!
    };
    
    const id = this.editingId();
    if (id) {
      this.http.patch<any>(`http://localhost:5000/api/v1/classes/${id}`, payload)
        .subscribe({
          next: (res) => {
            this.classes.update(arr => arr.map(c => c._id === id ? res.data : c));
            this.toast.show('Class updated.', 'success');
            this.close();
          },
          error: () => this.toast.show('Failed to update class.', 'error')
        });
    } else {
      this.http.post<any>('http://localhost:5000/api/v1/classes', payload)
        .subscribe({
          next: (res) => {
            this.classes.update(arr => [...arr, res.data]);
            this.toast.show('Class created.', 'success');
            this.close();
          },
          error: () => this.toast.show('Failed to create class.', 'error')
        });
    }
  }

  delete(c: any) {
    if (!confirm(`Delete class "${c.name}"?`)) return;
    this.http.delete(`http://localhost:5000/api/v1/classes/${c._id}`)
      .subscribe({
        next: () => {
          this.classes.update(arr => arr.filter(x => x._id !== c._id));
          this.toast.show('Class deleted.', 'success');
        },
        error: () => this.toast.show('Failed to delete class.', 'error')
      });
  }

  close() {
    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  getClassMembers(classId: string): any[] {
    const c = this.classes().find(x => x._id === classId);
    if (!c || !c.bookedMemberIds) return [];
    return this.users().filter(u => c.bookedMemberIds.includes(u._id));
  }

  getTrainerName(trainerIdOrObj: any): string {
    if (!trainerIdOrObj) return '—';
    if (typeof trainerIdOrObj === 'object' && trainerIdOrObj.name) return trainerIdOrObj.name;
    const t = this.trainers().find(x => x._id === trainerIdOrObj);
    return t ? t.name : 'Unknown';
  }

  viewDetails(c: any) {
    this.selectedClass.set(c);
  }

  closeDetails() {
    this.selectedClass.set(null);
  }
}
