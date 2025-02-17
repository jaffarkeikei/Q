import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Play, Pause } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { QueueItemCard } from "@/components/admin/QueueItem";
import { AddStudentDialog } from "@/components/admin/AddStudentDialog";

interface QueueItem {
  id: number;
  name: string;
  studentNumber: string;
  reason: string;
  position: number;
  joinedAt: Date;
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isQueueOpen, setIsQueueOpen] = useState(true);
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
    },
    {
      id: 2,
      name: "Jane Smith",
      studentNumber: "2345678901",
      reason: "Program requirements",
      position: 2,
      joinedAt: new Date(),
    },
    {
      id: 3,
      name: "Michael Johnson",
      studentNumber: "3456789012",
      reason: "Course withdrawal",
      position: 3,
      joinedAt: new Date(),
    },
    {
      id: 4,
      name: "Sarah Williams",
      studentNumber: "4567890123",
      reason: "Academic advising",
      position: 4,
      joinedAt: new Date(),
    },
    {
      id: 5,
      name: "David Brown",
      studentNumber: "5678901234",
      reason: "Transfer credits",
      position: 5,
      joinedAt: new Date(),
    },
    {
      id: 6,
      name: "Emily Davis",
      studentNumber: "6789012345",
      reason: "Graduation requirements",
      position: 6,
      joinedAt: new Date(),
    }
  ]);

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

    const newId = Math.max(...queueItems.map(item => item.id), 0) + 1;
    const newPosition = Math.max(...queueItems.map(item => item.position), 0) + 1;

    setQueueItems(prev => [...prev, {
      id: newId,
      name: newStudent.name,
      studentNumber: newStudent.studentNumber,
      reason: newStudent.reason,
      position: newPosition,
      joinedAt: new Date()
    }]);

    setNewStudent({
      name: "",
      studentNumber: "",
      reason: ""
    });

    toast({
      title: "Success",
      description: "Student added to queue",
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
      'Joined At'
    ];

    const csvData = queueItems.map(item => [
      item.studentNumber,
      item.name,
      item.reason,
      item.position.toString(),
      new Date(item.joinedAt).toLocaleString()
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
              id={item.id}
              name={item.name}
              studentNumber={item.studentNumber}
              reason={item.reason}
              joinedAt={item.joinedAt}
              position={item.position}
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
