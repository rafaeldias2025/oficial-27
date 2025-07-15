export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
}

export interface CustomFormatterProps {
  value: number;
  name: string;
  item: Record<string, unknown>;
  index: number;
  payload: Record<string, unknown>;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export type TimeFrame = 'day' | 'week' | 'month' | 'year';

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area';
  dataKey: string;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  name?: string;
}

export interface TooltipData {
  name: string;
  value: number;
  unit?: string;
  color?: string;
  percentage?: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipData[];
  label?: string;
  formatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
} 