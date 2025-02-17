import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Play, Pause } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { QueueItemCard } from "@/components/admin/QueueItem";
import { AddStudentDialog } from "@/components/admin/AddStudentDialog";
import { SettingsDialog } from "@/components/admin/SettingsDialog";

interface QueueItem {
  id: number;
  name: string;
  studentNumber: string;
  reason: string;
  position: number;
  joinedAt: Date;
  estimatedWaitTime?: number;
  assignedAdvisor?: string;
}

interface Advisor {
  id: string;
  name: string;
  isAvailable: boolean;
}

interface ScheduleSettings {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  timePerStudent: number;
  advisors: Advisor[];
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const [maxQueueSize, setMaxQueueSize] = useState(30);
  const [schedule, setSchedule] = useState<ScheduleSettings>({
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    timePerStudent: 15,
    advisors: []
  });
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentNumber: "",
    reason: ""
  });
  const { toast } = useToast();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([
    {
      id: 1,
      name: "John Doe",
      studentNumber: "1234567890",
      reason: "Course enrollment",
      position: 1,
      joinedAt: new Date(),
      estimatedWaitTime: 0,
      assignedAdvisor: ""
    },
    {
      id: 2,
      name: "Jane Smith",
      studentNumber: "2345678901",
      reason: "Program requirements",
      position: 2,
      joinedAt: new Date(),
      estimatedWaitTime: 0,
      assignedAdvisor: ""
    },
    {
      id: 3,
      name: "Michael Johnson",
      studentNumber: "3456789012",
      reason: "Course withdrawal",
      position: 3,
      joinedAt: new Date(),
      estimatedWaitTime: 0,
      assignedAdvisor: ""
    },
    {
      id: 4,
      name: "Sarah Williams",
      studentNumber: "4567890123",
      reason: "Academic advising",
      position: 4,
      joinedAt: new Date(),
      estimatedWaitTime: 0,
      assignedAdvisor: ""
    },
    {
      id: 5,
      name: "David Brown",
      studentNumber: "5678901234",
      reason: "Transfer credits",
      position: 5,
      joinedAt: new Date(),
      estimatedWaitTime: 0,
      assignedAdvisor: ""
    },
    {
      id: 6,
      name: "Emily Davis",
      studentNumber: "6789012345",
      reason: "Graduation requirements",
      position: 6,
      joinedAt: new Date(),
      estimatedWaitTime: 0,
      assignedAdvisor: ""
    }
  ]);

  const updateQueueEstimates = () => {
    const availableAdvisors = schedule.advisors.filter(a => a.isAvailable);
    if (availableAdvisors.length === 0) return;

    const advisorAssignments = new Map<string, number>();
    availableAdvisors.forEach(advisor => advisorAssignments.set(advisor.name, 0));

    const updatedQueue = queueItems.map((item, index) => {
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

  const handleScheduleChange = (newSchedule: ScheduleSettings) => {
    setSchedule(newSchedule);
    toast({
      title: "Schedule Updated",
      description: `Queue will operate on ${newSchedule.dayOfWeek}s from ${newSchedule.startTime} to ${newSchedule.endTime}`,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "123") {
      setIsLoggedIn(true);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const removeFromQueue = (id: number) => {
    setQueueItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Removed from queue",
      description: "Student has been removed from the queue",
    });
  };

  const handleMaxQueueSizeChange = (newSize: number) => {
    setMaxQueueSize(newSize);
    toast({
      title: "Settings Updated",
      description: `Maximum queue size set to ${newSize} students`,
    });

    if (queueItems.length >= newSize && isQueueOpen) {
      setIsQueueOpen(false);
      toast({
        title: "Queue Automatically Closed",
        description: "Current queue size exceeds the new maximum limit",
      });
    }
  };

  const addStudent = () => {
    if (!newStudent.name || !newStudent.studentNumber || !newStudent.reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newStudent.studentNumber.length !== 10) {
      toast({
        title: "Error",
        description: "Student number must be 10 digits",
        variant: "destructive",
      });
      return;
    }

    if (queueItems.length >= maxQueueSize) {
      setIsQueueOpen(false);
      toast({
        title: "Queue Full",
        description: "Maximum queue size reached. Queue has been automatically closed.",
        variant: "destructive",
      });
      return;
    }

    const availableAdvisors = schedule.advisors.filter(a => a.isAvailable);
    if (availableAdvisors.length === 0) {
      toast({
        title: "Error",
        description: "No advisors are currently available",
        variant: "destructive",
      });
      return;
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

    setNewStudent({
      name: "",
      studentNumber: "",
      reason: ""
    });

    toast({
      title: "Success",
      description: `Student added to queue and assigned to ${selectedAdvisor.name}`,
    });
  };

  const exportToCSV = () => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const headerRow = [
      'Student Number',
      '<th bgcolor="#006400">Name</th>',
      'Reason',
      'Position',
      'Joined At',
      'Estimated Wait Time (minutes)',
      'Assigned Advisor'
    ];

    const csvData = queueItems.map(item => [
      item.studentNumber,
      item.name,
      item.reason,
      item.position.toString(),
      new Date(item.joinedAt).toLocaleString(),
      item.estimatedWaitTime,
      item.assignedAdvisor
    ]);

    const csvString = [
      'sep=,',
      headerRow.join(','),
      ...csvData.map(row => 
        row.map((cell, colIndex) => {
          if (colIndex === 0) return `"${cell}"`.padEnd(15);
          return `"${cell}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      const fileName = `New College Registrar's Office Hours (${dayName}, ${dateStr}).csv`;
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Successful",
      description: "Queue data has been exported to CSV",
    });
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

  if (!isLoggedIn) {
    return (
      <LoginForm
        username={username}
        password={password}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
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
          <div className="flex gap-2">
            <Button
              variant={isQueueOpen ? "destructive" : "outline"}
              onClick={toggleQueue}
              className="flex items-center gap-2"
            >
              {isQueueOpen ? (
                <>
                  <Pause className="h-4 w-4" />
                  Stop Queue
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Queue
                </>
              )}
            </Button>
            <AddStudentDialog
              newStudent={newStudent}
              onNewStudentChange={setNewStudent}
              onAddStudent={addStudent}
            />
            <SettingsDialog
              maxQueueSize={maxQueueSize}
              onMaxQueueSizeChange={handleMaxQueueSizeChange}
              schedule={schedule}
              onScheduleChange={handleScheduleChange}
            />
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsLoggedIn(false)}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {queueItems.map((item) => (
            <QueueItemCard
              key={item.id}
              {...item}
              onRemove={removeFromQueue}
            />
          ))}
        </div>

        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <span className="text-sm text-gray-600">Total Students in Queue:</span>
          <span className="text-lg font-semibold">{queueItems.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Admin;
