export interface UserPoints {
  userId: string;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  streak: number;
  lastPointDate: string;
  history: PointHistory[];
}

export interface PointHistory {
  id: string;
  userId: string;
  points: number;
  category: PointCategory;
  source: PointSource;
  description: string;
  date: string;
  metadata?: Record<string, unknown>;
}

export type PointCategory = 
  | 'mission'
  | 'challenge'
  | 'exercise'
  | 'nutrition'
  | 'mindfulness'
  | 'bonus';

export type PointSource = 
  | 'daily_mission'
  | 'weekly_challenge'
  | 'weight_goal'
  | 'exercise_tracking'
  | 'nutrition_log'
  | 'meditation'
  | 'admin_bonus';

export interface WeeklyRanking {
  userId: string;
  name: string;
  avatar?: string;
  weeklyPoints: number;
  position: number;
  streak: number;
  weekStartDate: string;
  weekEndDate: string;
  categories: {
    [key in PointCategory]?: number;
  };
}

export interface RankingPeriod {
  startDate: string;
  endDate: string;
  rankings: WeeklyRanking[];
  totalParticipants: number;
  averagePoints: number;
  topScore: number;
}

export interface PointsStats {
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
  bestStreak: number;
  currentStreak: number;
  totalPoints: number;
  categoryDistribution: {
    [key in PointCategory]: number;
  };
  sourceDistribution: {
    [key in PointSource]: number;
  };
} 