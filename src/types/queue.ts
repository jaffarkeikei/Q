
export interface QueueItem {
  id: number;
  name: string;
  studentNumber: string;
  reason: string;
  position: number;
  joinedAt: Date;
  estimatedWaitTime?: number;
  assignedAdvisor?: string;
}

export interface Advisor {
  id: string;
  name: string;
  isAvailable: boolean;
}

export interface ScheduleSettings {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  timePerStudent: number;
  advisors: Advisor[];
}
