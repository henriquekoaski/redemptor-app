export type RepeatType = 'none' | 'daily' | 'weekly' | 'both';

export interface TaskLabel {
  name: string;
  color: string;
}

export interface Task {
  id: string;
  name: string;
  hasSpecificTime: boolean;
  time?: string; // Format: "HH:mm"
  repeatType: RepeatType;
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  label?: TaskLabel;
  createdAt: Date;
}

export interface TaskInstance {
  id: string;
  taskId: string;
  date: Date;
  time?: string;
  completed: boolean;
}

