import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToastService } from '../../../core/services/toast.service';
import { BILLING_CYCLES } from '../../../constants/gym-constants';

@Component({
  selector: 'app-admin-plans',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './admin-plans.component.html'
})
export class AdminPlansComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  billingCycles = BILLING_CYCLES;
  modalOpen = signal(false);
  editingId = signal<string | null>(null);
  selectedPlan = signal<any | null>(null);

  plans = signal<any[]>([]);
  users = signal<any[]>([]);


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      plans: this.http.get<any>('http://localhost:5000/api/v1/memberships'),
      users: this.http.get<any>('http://localhost:5000/api/v1/users')
    }).subscribe({
      next: (res) => {
        if (res.plans.success) this.plans.set(res.plans.data);
        if (res.users.success) this.users.set(res.users.data.filter((u: any) => u.role === 'member'));
      },
      error: (err) => {
        console.error('Error loading plans', err);
        this.toast.show('Failed to load plans.', 'error');
      }
    });
  }

  form = this.fb.group({
    name: ['', Validators.required],
    tagline: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    billingCycle: ['month' as (typeof BILLING_CYCLES)[number], Validators.required],
    features: ['', Validators.required]
  });

  openModal(plan?: any) {
    this.modalOpen.set(true);
    this.editingId.set(plan?._id ?? null);
    this.form.reset(
      plan
        ? { name: plan.name, tagline: plan.tagline || '', price: plan.price, billingCycle: plan.duration || 'month', features: plan.features.join(', ') }
        : { name: '', tagline: '', price: 0, billingCycle: 'month', features: '' }
    );
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const features = v.features!.split(',').map((f) => f.trim()).filter(Boolean);
    const payload = { name: v.name!, tagline: v.tagline, price: v.price!, duration: v.billingCycle!, features };
    const id = this.editingId();
    
    if (id) {
      this.http.patch<any>(`http://localhost:5000/api/v1/memberships/${id}`, payload)
        .subscribe({
          next: (res) => {
            this.plans.update(plans => plans.map(p => p._id === id ? res.data : p));
            this.toast.show('Plan updated.', 'success');
            this.close();
          },
          error: () => this.toast.show('Failed to update plan.', 'error')
        });
    } else {
      this.http.post<any>('http://localhost:5000/api/v1/memberships', payload)
        .subscribe({
          next: (res) => {
            this.plans.update(plans => [...plans, res.data]);
            this.toast.show('Plan created.', 'success');
            this.close();
          },
          error: () => this.toast.show('Failed to create plan.', 'error')
        });
    }
  }

  delete(p: any) {
    if (!confirm(`Delete the "${p.name}" plan?`)) return;
    this.http.delete(`http://localhost:5000/api/v1/memberships/${p._id}`)
      .subscribe({
        next: () => {
          this.plans.update(plans => plans.filter(x => x._id !== p._id));
          this.toast.show('Plan deleted.', 'success');
        },
        error: () => this.toast.show('Failed to delete plan.', 'error')
      });
  }

  close() {
    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  getPlanMembers(planId: string): any[] {
    return this.users().filter((u) => u.membership?._id === planId);
  }

  viewDetails(p: any) {
    this.selectedPlan.set(p);
  }

  closeDetails() {
    this.selectedPlan.set(null);
  }
}
