export interface GymClass {
  id: string;
  name: string;
  trainerId: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  startTime: string;
  durationMins: number;
  category: 'Strength' | 'Cardio' | 'HIIT' | 'Yoga' | 'Boxing' | 'CrossFit';
  capacity: number;
  bookedMemberIds: string[];
  room: string;
}
