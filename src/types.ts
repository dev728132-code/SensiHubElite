export interface UserProfile {
  userId: string;
  displayName: string;
  photoURL: string;
  membershipStatus: string;
  activePlans?: string[];
  lastLogin: any;
  createdAt: any;
}

export interface HistoryItem {
  id: string;
  userId: string;
  itemType: 'used' | 'saved' | 'purchased';
  brand: string;
  model: string;
  game: string;
  configName: string;
  sensitivityData: string; // JSON string of settings
  createdAt: any;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  planName: string;
  amount: number;
  utrNumber: string;
  mobileNumber: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: any;
}

export interface SensitivityConfig {
  id: string;
  name: string;
  brand: string;
  model: string;
  game: string;
  type: 'free' | 'premium';
  plan?: string;
  description?: string;
  price?: number;
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  scope6x?: number;
  sniperScope: number;
  freeLook: number;
  features?: string[];
  createdAt?: any;
}
