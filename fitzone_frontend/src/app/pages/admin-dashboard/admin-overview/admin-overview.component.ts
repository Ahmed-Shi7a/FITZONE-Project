import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-overview.component.html'
})
export class AdminOverviewComponent implements OnInit {
  private http = inject(HttpClient);
  
  loading = signal(true);
  
  dashboardData = signal<any>(null);

  kpiCards = computed(() => {
    const data = this.dashboardData();
    if (!data) return [];
    return [
      { label: 'Total Members', value: data.users?.activeMembers || 0, accent: 'orange' },
      { label: 'Active Plans', value: data.memberships?.active || 0, accent: 'blue' },
      { label: 'Trainers', value: data.trainers?.active || 0, accent: 'orange' },
      { label: 'Monthly Revenue', value: (data.revenue || 0).toLocaleString() + ' EGP', accent: 'blue' }
    ];
  });

  plans = computed(() => {
    const data = this.dashboardData();
    return data?.planDistribution || [];
  });

  ngOnInit() {


    this.http.get<any>('http://localhost:5000/api/v1/dashboard').subscribe({
      next: (res) => {
        if (res.success) {
          this.dashboardData.set(res.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
        this.loading.set(false);
      }
    });
  }
}
