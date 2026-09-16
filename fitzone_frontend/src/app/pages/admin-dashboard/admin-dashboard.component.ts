import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent {
  tabs = [
    { path: 'overview', label: 'Overview' },
    { path: 'members', label: 'Members' },
    { path: 'plans', label: 'Plans' },
    { path: 'trainers', label: 'Trainers' },
    { path: 'classes', label: 'Classes' }
  ];
}
