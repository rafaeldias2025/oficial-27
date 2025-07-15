export interface WeightMeasurement {
  id: string;
  userId: string;
  weight: number;
  date: string;
  bmi?: number;
  bodyFat?: number;
  muscleMass?: number;
  waterPercentage?: number;
  visceralFat?: number;
  bodyAge?: number;
  boneMass?: number;
  basalMetabolism?: number;
}

export interface MeasurementGoal {
  id: string;
  userId: string;
  targetWeight: number;
  startDate: string;
  targetDate: string;
  achieved: boolean;
  notes?: string;
}

export interface BodyMeasurements {
  id: string;
  userId: string;
  date: string;
  chest?: number;
  waist?: number;
  hip?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  abdominal?: number;
}

export interface WeightAnalytics {
  currentWeight: number;
  weightChange: number;
  timeFrame: 'week' | 'month' | 'year';
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
}

export interface BluetoothScaleDevice {
  id: string;
  name: string;
  deviceId?: string;
  connected: boolean;
  lastConnection?: string;
  manufacturer?: string;
  serviceUUID?: string;
  characteristicUUID?: string;
} 