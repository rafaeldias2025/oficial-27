export interface Mission {
  id: string;
  userId: string;
  date: string;
  type: 'daily' | 'weekly' | 'challenge';
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: 'health' | 'mindfulness' | 'exercise' | 'nutrition';
  requirements?: string[];
  deadline?: string;
}

export interface WeeklyScore {
  userId: string;
  week: string;
  totalPoints: number;
  completedMissions: number;
  totalMissions: number;
  streak: number;
  categories: {
    health: number;
    mindfulness: number;
    exercise: number;
    nutrition: number;
  };
}

export interface UserRanking {
  userId: string;
  name: string;
  avatar?: string;
  weeklyAverage: number;
  totalPoints: number;
  position: number;
  streak: number;
  level: number;
}

export interface MissionProgress {
  missionId: string;
  userId: string;
  startDate: string;
  completionDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  notes?: string;
  evidence?: string[];
} 