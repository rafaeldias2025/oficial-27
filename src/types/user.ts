export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'user' | 'trainer';
  status: 'active' | 'inactive' | 'pending';
  last_login?: string;
  preferences?: UserPreferences;
  profile?: UserProfile;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  timezone: string;
}

export interface UserProfile {
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  height: number;
  initialWeight?: number;
  targetWeight?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extremely_active';
  dietaryRestrictions?: string[];
  healthConditions?: string[];
  goals?: string[];
  phone?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface UserStats {
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  streak: number;
  level: number;
  badges: string[];
  completedMissions: number;
  totalMissions: number;
  completionRate: number;
  weightLoss?: number;
  daysActive: number;
}

export interface UserSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  type: 'training' | 'consultation' | 'assessment';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  trainer?: {
    id: string;
    name: string;
    specialization: string;
  };
} 