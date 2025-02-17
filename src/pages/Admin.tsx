
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/admin/LoginForm";
import { QueueItemCard } from "@/components/admin/QueueItem";
import { QueueStats } from "@/components/admin/QueueStats";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { useQueueManagement } from "@/hooks/useQueueManagement";
import { useScheduleManagement } from "@/hooks/useScheduleManagement";
import { ScheduleSettings } from "@/types/queue";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [maxQueueSize, setMaxQueueSize] = useState(30);
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentNumber: "",
    reason: ""
  });

  const initialSchedule: ScheduleSettings = {
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    timePerStudent: 15,
    advisors: []
  };

  const { toast } = useToast();
  const { schedule, isQueueOpen, handleScheduleChange, toggleQueue } = useScheduleManagement(initialSchedule);
  const { queueItems, addStudent, removeFromQueue } = useQueueManagement(maxQueueSize, schedule);

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

  const handleMaxQueueSizeChange = (newSize: number) => {
    setMaxQueueSize(newSize);
    toast({
      title: "Settings Updated",
      description: `Maximum queue size set to ${newSize} students`,
    });
  };

  const exportToCSV = () => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const headerRow = [
      'Student Number',
      'Name',
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
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `New College Registrar's Office Hours (${dayName}, ${dateStr}).csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Queue data has been exported to CSV",
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
          <QueueStats
            queueItems={queueItems}
            maxQueueSize={maxQueueSize}
            schedule={schedule}
            isQueueOpen={isQueueOpen}
          />
          <ActionButtons
            isQueueOpen={isQueueOpen}
            toggleQueue={toggleQueue}
            newStudent={newStudent}
            onNewStudentChange={setNewStudent}
            onAddStudent={() => {
              const success = addStudent(newStudent);
              if (success) {
                setNewStudent({ name: "", studentNumber: "", reason: "" });
              }
            }}
            maxQueueSize={maxQueueSize}
            onMaxQueueSizeChange={handleMaxQueueSizeChange}
            schedule={schedule}
            onScheduleChange={handleScheduleChange}
            onExportCSV={exportToCSV}
            onLogout={() => setIsLoggedIn(false)}
          />
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
