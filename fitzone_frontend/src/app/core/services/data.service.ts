import { Injectable, signal, computed, effect } from '@angular/core';
import { AppUser } from '../../interfaces/user-interface';
import { MembershipPlan } from '../../interfaces/plan-interface';
import { Trainer } from '../../interfaces/trainer-interface';
import { GymClass } from '../../interfaces/class-interface';

const STORAGE_KEYS = {
  USERS: 'fitzone_users',
  PLANS: 'fitzone_plans',
  TRAINERS: 'fitzone_trainers',
  CLASSES: 'fitzone_classes'
};

const SEED_USERS: AppUser[] = [
  { id: 'u-1', name: 'Admin User', email: 'admin@fitzone.com', password: 'admin123', role: 'admin', avatarInitials: 'AD', joinDate: '2024-01-01' },
  { id: 'u-2', name: 'Nora Emad', email: 'member@fitzone.com', password: 'member123', role: 'member', avatarInitials: 'NE', joinDate: '2024-03-02', planId: 'p-2', trainerId: 't-1' }
];

const SEED_PLANS: MembershipPlan[] = [
  { id: 'p-1', name: 'Basic Plan', tagline: 'For beginners', price: 500, billingCycle: 'month', features: ['Gym Access', 'Locker Room'], activeMembers: 120 },
  { id: 'p-2', name: 'Pro Plan', tagline: 'Most Popular', price: 800, billingCycle: 'month', features: ['Gym Access', 'All Classes', 'Sauna'], highlight: true, activeMembers: 350 },
  { id: 'p-3', name: 'Elite Plan', tagline: 'Ultimate Experience', price: 1200, billingCycle: 'month', features: ['Pro Plan Benefits', 'Personal Trainer', 'Spa'], activeMembers: 80 }
];

const SEED_TRAINERS: Trainer[] = [
  { id: 't-1', name: 'Ahmed Ali', specialty: 'Strength & Conditioning', experienceYears: 8, bio: 'Expert in weightlifting and muscle building.', rating: 4.9, initials: 'AA' },
  { id: 't-2', name: 'Sara Tarek', specialty: 'Yoga & Flexibility', experienceYears: 5, bio: 'Certified yoga instructor focusing on core and flexibility.', rating: 4.8, initials: 'ST' },
  { id: 't-3', name: 'Omar Hassan', specialty: 'HIIT & Cardio', experienceYears: 6, bio: 'High-intensity interval training specialist.', rating: 4.7, initials: 'OH' },
  { id: 't-4', name: 'Mona Youssef', specialty: 'CrossFit', experienceYears: 4, bio: 'CrossFit coach dedicated to full-body transformations.', rating: 4.9, initials: 'MY' }
];

const SEED_CLASSES: GymClass[] = [
  { id: 'c-1', name: 'Morning Power', trainerId: 't-1', day: 'Mon', startTime: '08:00 AM', durationMins: 60, category: 'Strength', capacity: 20, bookedMemberIds: ['u-2'], room: 'Weight Room A' },
  { id: 'c-2', name: 'Vinyasa Flow', trainerId: 't-2', day: 'Tue', startTime: '06:00 PM', durationMins: 60, category: 'Yoga', capacity: 15, bookedMemberIds: [], room: 'Studio 1' },
  { id: 'c-3', name: 'HIIT Blast', trainerId: 't-3', day: 'Wed', startTime: '07:00 PM', durationMins: 45, category: 'HIIT', capacity: 25, bookedMemberIds: ['u-2'], room: 'Cardio Zone' },
  { id: 'c-4', name: 'Boxing Basics', trainerId: 't-4', day: 'Thu', startTime: '05:00 PM', durationMins: 60, category: 'Boxing', capacity: 12, bookedMemberIds: [], room: 'Ring Area' },
  { id: 'c-5', name: 'Advanced CrossFit', trainerId: 't-4', day: 'Fri', startTime: '06:00 AM', durationMins: 90, category: 'CrossFit', capacity: 20, bookedMemberIds: [], room: 'CrossFit Arena' },
  { id: 'c-6', name: 'Weekend Recovery', trainerId: 't-2', day: 'Sat', startTime: '10:00 AM', durationMins: 45, category: 'Yoga', capacity: 30, bookedMemberIds: [], room: 'Studio 2' },
  { id: 'c-7', name: 'Leg Day Killer', trainerId: 't-1', day: 'Mon', startTime: '07:00 PM', durationMins: 60, category: 'Strength', capacity: 15, bookedMemberIds: [], room: 'Weight Room A' },
  { id: 'c-8', name: 'Fat Burn Express', trainerId: 't-3', day: 'Tue', startTime: '07:00 AM', durationMins: 30, category: 'Cardio', capacity: 20, bookedMemberIds: [], room: 'Cardio Zone' },
  { id: 'c-9', name: 'Core Crusher', trainerId: 't-3', day: 'Wed', startTime: '06:00 PM', durationMins: 45, category: 'HIIT', capacity: 20, bookedMemberIds: [], room: 'Studio 1' },
  { id: 'c-10', name: 'Powerlifting 101', trainerId: 't-1', day: 'Thu', startTime: '08:00 PM', durationMins: 90, category: 'Strength', capacity: 10, bookedMemberIds: [], room: 'Weight Room B' },
  { id: 'c-11', name: 'Ashtanga Yoga', trainerId: 't-2', day: 'Fri', startTime: '05:00 PM', durationMins: 75, category: 'Yoga', capacity: 15, bookedMemberIds: [], room: 'Studio 1' },
  { id: 'c-12', name: 'MetCon Madness', trainerId: 't-4', day: 'Sat', startTime: '11:00 AM', durationMins: 60, category: 'CrossFit', capacity: 25, bookedMemberIds: [], room: 'CrossFit Arena' },
  { id: 'c-13', name: 'Sunday Stretch', trainerId: 't-2', day: 'Sun', startTime: '09:00 AM', durationMins: 60, category: 'Yoga', capacity: 20, bookedMemberIds: [], room: 'Studio 2' },
  { id: 'c-14', name: 'Endurance Cardio', trainerId: 't-3', day: 'Sun', startTime: '10:00 AM', durationMins: 60, category: 'Cardio', capacity: 25, bookedMemberIds: [], room: 'Cardio Zone' },
  { id: 'c-15', name: 'Upper Body Pump', trainerId: 't-1', day: 'Mon', startTime: '06:00 PM', durationMins: 60, category: 'Strength', capacity: 18, bookedMemberIds: [], room: 'Weight Room A' }
];

function loadFromStorage<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return seed;
}

// ✅ Services
@Injectable({ providedIn: 'root' })
export class DataService {
  
  users = signal<AppUser[]>(loadFromStorage(STORAGE_KEYS.USERS, SEED_USERS));
  plans = signal<MembershipPlan[]>(loadFromStorage(STORAGE_KEYS.PLANS, SEED_PLANS));
  trainers = signal<Trainer[]>(loadFromStorage(STORAGE_KEYS.TRAINERS, SEED_TRAINERS));
  classes = signal<GymClass[]>(loadFromStorage(STORAGE_KEYS.CLASSES, SEED_CLASSES));

  constructor() {
    // Automatically persist to localStorage whenever signals change
    effect(() => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users())));
    effect(() => localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(this.plans())));
    effect(() => localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(this.trainers())));
    effect(() => localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(this.classes())));
  }

  kpis = computed(() => {
    const totalMembers = this.users().filter(u => u.role === 'member').length;
    const activePlans = this.plans().length;
    const totalTrainers = this.trainers().length;
    const monthlyRevenue = this.users().filter(u => u.role === 'member' && u.planId).map(u => this.plans().find(p => p.id === u.planId)?.price || 0).reduce((a, b) => a + b, 0);
    
    return { 
      totalMembers: Math.max(totalMembers, 500),
      activePlans,
      totalTrainers,
      monthlyRevenue: Math.max(monthlyRevenue, 150000)
    };
  });

  findUserByEmail(email: string): AppUser | undefined {
    return this.users().find(u => u.email === email);
  }

  addUser(user: AppUser) {
    this.users.update(users => [...users, user]);
  }

  updateUser(id: string, updatedData: Partial<AppUser>) {
    this.users.update(users => 
      users.map(u => (u.id === id ? { ...u, ...updatedData } : u))
    );
  }

  deleteUser(id: string) {
    this.users.update(users => users.filter(u => u.id !== id));
  }

  updateClass(id: string, updated: Partial<GymClass>) {
    this.classes.update(cls => cls.map(c => c.id === id ? { ...c, ...updated } : c));
  }

  addClass(newClass: GymClass) {
    this.classes.update(cls => [...cls, newClass]);
  }

  deleteClass(id: string) {
    this.classes.update(cls => cls.filter(c => c.id !== id));
  }

  updatePlan(id: string, updated: Partial<MembershipPlan>) {
    this.plans.update(plans => plans.map(p => p.id === id ? { ...p, ...updated } : p));
  }

  addPlan(newPlan: MembershipPlan) {
    this.plans.update(plans => [...plans, newPlan]);
  }

  deletePlan(id: string) {
    this.plans.update(plans => plans.filter(p => p.id !== id));
  }

  updateTrainer(id: string, updated: Partial<Trainer>) {
    this.trainers.update(tr => tr.map(t => t.id === id ? { ...t, ...updated } : t));
  }

  addTrainer(newTrainer: Trainer) {
    this.trainers.update(tr => [...tr, newTrainer]);
  }

  deleteTrainer(id: string) {
    this.trainers.update(tr => tr.filter(t => t.id !== id));
  }

  memberBookings(uid: string) {
    return this.classes().filter(c => c.bookedMemberIds.includes(uid));
  }

  bookClass(uid: string, classId: string) {
    this.classes.update(classes =>
      classes.map(c => {
        if (c.id === classId && !c.bookedMemberIds.includes(uid)) {
          return { ...c, bookedMemberIds: [...c.bookedMemberIds, uid] };
        }
        return c;
      })
    );
    return { ok: true, message: 'Class booked successfully.' };
  }

  cancelBooking(uid: string, classId: string) {
    this.classes.update(classes =>
      classes.map(c => {
        if (c.id === classId) {
          return { ...c, bookedMemberIds: c.bookedMemberIds.filter(id => id !== uid) };
        }
        return c;
      })
    );
    return { ok: true, message: 'Booking cancelled.' };
  }

  trainerName(trainerId: string): string {
    return this.trainers().find(t => t.id === trainerId)?.name || 'Unknown Trainer';
  }
}