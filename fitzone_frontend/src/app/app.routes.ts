import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

// ✅ Routing (define routes- navigating using router link and router service navigate by url or navigate function)
import { CourseDetailsComponent } from './pages/dummy/course-details.component';
import { ContactComponent } from './pages/dummy/contact.component';
import { SignalFormComponent } from './pages/dummy/signal-form.component';

// Routing (define routes)
export const routes: Routes = [
  { path: 'course/:id', component: CourseDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'signal-form', component: SignalFormComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent) },
  { path: 'signin', loadComponent: () => import('./pages/auth/signin/signin.component').then((m) => m.SigninComponent) },
  { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup.component').then((m) => m.SignupComponent) },

  {
    path: 'member-dashboard',
    loadComponent: () => import('./pages/member-dashboard/member-dashboard.component').then((m) => m.MemberDashboardComponent),
    canActivate: [roleGuard('member')],
    // ✅ Routing (Route child)
      children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', loadComponent: () => import('./pages/member-dashboard/member-overview/member-overview.component').then((m) => m.MemberOverviewComponent) },
      { path: 'timetable', loadComponent: () => import('./pages/member-dashboard/member-timetable/member-timetable.component').then((m) => m.MemberTimetableComponent) },
      { path: 'plans', loadComponent: () => import('./pages/member-dashboard/plans.component').then((m) => m.PlansComponent) },
      { path: 'trainers', loadComponent: () => import('./pages/member-dashboard/trainers.component').then((m) => m.TrainersComponent) }
    ]
  },

  {
    path: 'admin-dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
    canActivate: [roleGuard('admin')],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', loadComponent: () => import('./pages/admin-dashboard/admin-overview/admin-overview.component').then((m) => m.AdminOverviewComponent) },
      { path: 'members', loadComponent: () => import('./pages/admin-dashboard/admin-members/admin-members.component').then((m) => m.AdminMembersComponent) },
      { path: 'plans', loadComponent: () => import('./pages/admin-dashboard/admin-plans/admin-plans.component').then((m) => m.AdminPlansComponent) },
      { path: 'trainers', loadComponent: () => import('./pages/admin-dashboard/admin-trainers/admin-trainers.component').then((m) => m.AdminTrainersComponent) },
      { path: 'classes', loadComponent: () => import('./pages/admin-dashboard/admin-classes/admin-classes.component').then((m) => m.AdminClassesComponent) }
    ]
  },

  { path: 'item-details/:id', loadComponent: () => import('./pages/item-details/item-details.component').then((m) => m.ItemDetailsComponent) },
  { path: '**', redirectTo: 'home' }
];