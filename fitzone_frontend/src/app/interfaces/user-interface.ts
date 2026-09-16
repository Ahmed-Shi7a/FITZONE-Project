export type UserRole = 'admin' | 'member';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string; // mock only, never do this in a real app
  role: UserRole;
  avatarInitials: string;
  joinDate: string;
  planId?: string;
  membership?: any;
  trainerId?: string;
}