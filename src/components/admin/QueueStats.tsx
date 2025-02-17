
import { QueueItem } from "@/types/queue";

interface QueueStatsProps {
  queueItems: QueueItem[];
  maxQueueSize: number;
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    advisors: { isAvailable: boolean }[];
  };
  isQueueOpen: boolean;
}

export const QueueStats = ({
  queueItems,
  maxQueueSize,
  schedule,
  isQueueOpen,
}: QueueStatsProps) => {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold">Queue Management</h1>
      <p className="text-sm text-gray-500">
        Status: <span className={isQueueOpen ? "text-green-600" : "text-red-600"}>
          {isQueueOpen ? "Open" : "Closed"}
        </span>
      </p>
      <p className="text-sm text-gray-500">
        Queue Capacity: {queueItems.length} / {maxQueueSize}
      </p>
      <p className="text-sm text-gray-500">
        Schedule: {schedule.dayOfWeek}s, {schedule.startTime} - {schedule.endTime}
      </p>
      <p className="text-sm text-gray-500">
        Available Advisors: {schedule.advisors.filter(a => a.isAvailable).length}
      </p>
    </div>
  );
};
