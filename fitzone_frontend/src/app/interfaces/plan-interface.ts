export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  billingCycle: 'month' | 'year';
  features: string[];
  highlight?: boolean;
  activeMembers: number;
}
