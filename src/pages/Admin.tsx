import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, User, Clock, Download, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-500">Enter your credentials to manage the queue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Queue Management</h1>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student to Queue</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Full Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Student Number (10 digits)"
                    value={newStudent.studentNumber}
                    onChange={(e) => setNewStudent(prev => ({ 
                      ...prev, 
                      studentNumber: e.target.value.replace(/\D/g, "").slice(0, 10)
                    }))}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <Textarea
                    placeholder="Reason for Visit"
                    value={newStudent.reason}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, reason: e.target.value }))}
                    className="resize-none"
                    rows={3}
                  />
                  <Button onClick={addStudent} className="w-full">
                    Add to Queue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="text-sm text-gray-500">({item.studentNumber})</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.reason}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Joined: {new Date(item.joinedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromQueue(item.id)}
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
