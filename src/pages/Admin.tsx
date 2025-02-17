
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, User, Clock } from "lucide-react";

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
    // Add more mock data as needed
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
          <Button
            variant="outline"
            onClick={() => setIsLoggedIn(false)}
          >
            Logout
          </Button>
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
