
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScheduleSettings } from "@/types/queue";

export const useScheduleManagement = (initialSchedule: ScheduleSettings) => {
  const [schedule, setSchedule] = useState<ScheduleSettings>(initialSchedule);
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      if (currentDay === schedule.dayOfWeek) {
        if (currentTime >= schedule.startTime && currentTime <= schedule.endTime) {
          if (!isQueueOpen) {
            setIsQueueOpen(true);
            toast({
              title: "Queue Opened",
              description: "Queue schedule has started",
            });
          }
        } else {
          if (isQueueOpen) {
            setIsQueueOpen(false);
            toast({
              title: "Queue Closed",
              description: "Queue is now outside operating hours",
            });
          }
        }
      }
    };

    const interval = setInterval(checkSchedule, 60000);
    checkSchedule();

    return () => clearInterval(interval);
  }, [schedule, isQueueOpen, toast]);

  const handleScheduleChange = (newSchedule: ScheduleSettings) => {
    setSchedule(newSchedule);
  };

  const toggleQueue = () => {
    setIsQueueOpen(prev => !prev);
    toast({
      title: isQueueOpen ? "Queue Closed" : "Queue Opened",
      description: isQueueOpen 
        ? "Students can no longer join the queue" 
        : "Students can now join the queue",
    });
  };

  return {
    schedule,
    isQueueOpen,
    handleScheduleChange,
    toggleQueue,
  };
};
