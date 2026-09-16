import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './member-dashboard.component.html'
})
export class MemberDashboardComponent {
  auth = inject(AuthService);
  data = inject(DataService);

  tabs = [
    { path: 'overview', label: 'Overview' },
    { path: 'timetable', label: 'Class Timetable' },
    { path: 'plans', label: 'Membership Plans' },
    { path: 'trainers', label: 'Elite Trainers' }
  ];

  currentPlan() {
    const user = this.auth.currentUser() as any;
    if (user && user.membership && user.membership.name) {
      return user.membership;
    }
    return null;
  }
}