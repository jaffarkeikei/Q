import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { QueueItem, ScheduleSettings } from "@/types/queue";

export const useQueueManagement = (maxQueueSize: number, schedule: ScheduleSettings) => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const { toast } = useToast();

  const updateQueueEstimates = () => {
    const availableAdvisors = schedule.advisors.filter(a => a.isAvailable);
    if (availableAdvisors.length === 0) return;

    const advisorAssignments = new Map<string, number>();
    availableAdvisors.forEach(advisor => advisorAssignments.set(advisor.name, 0));

    const updatedQueue = queueItems.map((item) => {
      let selectedAdvisor = availableAdvisors[0];
      let lowestLoad = advisorAssignments.get(selectedAdvisor.name) || 0;

      availableAdvisors.forEach(advisor => {
        const currentLoad = advisorAssignments.get(advisor.name) || 0;
        if (currentLoad < lowestLoad) {
          selectedAdvisor = advisor;
          lowestLoad = currentLoad;
        }
      });

      advisorAssignments.set(selectedAdvisor.name, lowestLoad + 1);
      const estimatedWaitTime = lowestLoad * schedule.timePerStudent;

      return {
        ...item,
        estimatedWaitTime,
        assignedAdvisor: selectedAdvisor.name
      };
    });

    setQueueItems(updatedQueue);
  };

  useEffect(() => {
    updateQueueEstimates();
  }, [schedule.advisors, schedule.timePerStudent, queueItems.length]);

  const isValidName = (name: string): boolean => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    return nameRegex.test(name.trim());
  };

  const addStudent = (newStudent: { name: string; studentNumber: string; reason: string }) => {
    const nameParts = newStudent.name.trim().split(/\s+/);
    
    if (nameParts.length < 2) {
      toast({
        title: "Error",
        description: "Please provide both first and last name",
        variant: "destructive",
      });
      return false;
    }

    for (const part of nameParts) {
      if (!isValidName(part)) {
        toast({
          title: "Error",
          description: "Names can only contain letters, hyphens, and apostrophes",
          variant: "destructive",
        });
        return false;
      }
    }

    if (!newStudent.name || !newStudent.studentNumber || !newStudent.reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    if (newStudent.studentNumber.length !== 10) {
      toast({
        title: "Error",
        description: "Student number must be 10 digits",
        variant: "destructive",
      });
      return false;
    }

    if (queueItems.length >= maxQueueSize) {
      toast({
        title: "Queue Full",
        description: "Maximum queue size reached.",
        variant: "destructive",
      });
      return false;
    }

    const availableAdvisors = schedule.advisors.filter(a => a.isAvailable);
    if (availableAdvisors.length === 0) {
      toast({
        title: "Error",
        description: "No advisors are currently available",
        variant: "destructive",
      });
      return false;
    }

    const advisorAssignments = new Map<string, number>();
    availableAdvisors.forEach(advisor => advisorAssignments.set(advisor.name, 0));

    queueItems.forEach(item => {
      if (item.assignedAdvisor) {
        advisorAssignments.set(
          item.assignedAdvisor,
          (advisorAssignments.get(item.assignedAdvisor) || 0) + 1
        );
      }
    });

    let selectedAdvisor = availableAdvisors[0];
    let lowestLoad = advisorAssignments.get(selectedAdvisor.name) || 0;

    availableAdvisors.forEach(advisor => {
      const currentLoad = advisorAssignments.get(advisor.name) || 0;
      if (currentLoad < lowestLoad) {
        selectedAdvisor = advisor;
        lowestLoad = currentLoad;
      }
    });

    const newId = Math.max(...queueItems.map(item => item.id), 0) + 1;
    const newPosition = Math.max(...queueItems.map(item => item.position), 0) + 1;
    const estimatedWaitTime = lowestLoad * schedule.timePerStudent;

    setQueueItems(prev => [...prev, {
      id: newId,
      name: newStudent.name,
      studentNumber: newStudent.studentNumber,
      reason: newStudent.reason,
      position: newPosition,
      joinedAt: new Date(),
      estimatedWaitTime,
      assignedAdvisor: selectedAdvisor.name
    }]);

    toast({
      title: "Added to Queue",
      description: `You've been assigned to ${selectedAdvisor.name} in Room ${selectedAdvisor.roomNumber}`,
    });
    return true;
  };

  const removeFromQueue = (id: number) => {
    setQueueItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Removed from queue",
      description: "Student has been removed from the queue",
    });
  };

  const changeAdvisor = (studentId: number, newAdvisor: string) => {
    const advisor = schedule.advisors.find(a => a.name === newAdvisor);
    if (!advisor) {
      toast({
        title: "Error",
        description: "Selected advisor not found",
        variant: "destructive",
      });
      return;
    }

    const currentStudent = queueItems.find(item => item.id === studentId);
    const isCurrentAdvisor = currentStudent?.assignedAdvisor === newAdvisor;

    if (!advisor.isAvailable && !isCurrentAdvisor) {
      toast({
        title: "Error",
        description: "Selected advisor is not available",
        variant: "destructive",
      });
      return;
    }

    setQueueItems(items => items.map(item => 
      item.id === studentId 
        ? { ...item, assignedAdvisor: newAdvisor }
        : item
    ));

    toast({
      title: "Advisor Changed",
      description: `Reassigned to ${advisor.name} in Room ${advisor.roomNumber}`,
    });

    updateQueueEstimates();
  };

  return {
    queueItems,
    addStudent,
    removeFromQueue,
    changeAdvisor,
  };
};
