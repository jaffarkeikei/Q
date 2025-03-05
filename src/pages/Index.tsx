import { useState } from "react";
import { Link } from "react-router-dom";
import JoinQueueForm from "@/components/JoinQueueForm";
import QueueCard from "@/components/QueueCard";
import { useToast } from "@/hooks/use-toast";
interface QueueUser {
  name: string;
  studentNumber: string;
  reason: string;
  position: number;
  joinedAt: Date;
}
const Index = () => {
  const [currentUser, setCurrentUser] = useState<QueueUser | null>(null);
  const [queueLength, setQueueLength] = useState(15); // Simulated queue length
  const {
    toast
  } = useToast();
  const handleJoinQueue = (name: string, studentNumber: string, reason: string) => {
    const position = Math.floor(Math.random() * 5) + 1; // Simulated position (1-5)

    setCurrentUser({
      name,
      studentNumber,
      reason,
      position,
      joinedAt: new Date()
    });
    toast({
      title: "Joined Queue",
      description: "You have successfully joined the queue."
    });
  };
  const estimatedWaitTime = currentUser ? currentUser.position * 15 : 0;
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-md mx-auto px-4 py-12 rounded-none">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Q</h1>
          <p className="text-gray-600">Student Queue Management</p>
          <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-700">
            Admin Login
          </Link>
        </div>

        {currentUser ? <div className="space-y-6">
            <QueueCard position={currentUser.position} estimatedTime={estimatedWaitTime} totalInQueue={queueLength} />
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Reason for visit: <span className="font-medium">{currentUser.reason}</span>
              </p>
              <p className="text-sm text-gray-500">
                Please wait to be called. Make sure to have your student ID ready.
              </p>
            </div>
          </div> : <div className="space-y-6">
            <JoinQueueForm onJoin={handleJoinQueue} />
            <p className="text-center text-sm text-gray-500">
              Current estimated wait time: 15-30 minutes
            </p>
          </div>}
      </div>
    </div>;
};
export default Index;