
import { useState } from "react";
import JoinQueueForm from "@/components/JoinQueueForm";
import QueueCard from "@/components/QueueCard";
import { useToast } from "@/hooks/use-toast";

interface QueueUser {
  name: string;
  studentNumber: string;
  position: number;
  joinedAt: Date;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<QueueUser | null>(null);
  const [queueLength, setQueueLength] = useState(15); // Simulated queue length
  const { toast } = useToast();

  const handleJoinQueue = (name: string, studentNumber: string) => {
    const position = Math.floor(Math.random() * 5) + 1; // Simulated position (1-5)
    
    setCurrentUser({
      name,
      studentNumber,
      position,
      joinedAt: new Date(),
    });

    toast({
      title: "Joined Queue",
      description: "You have successfully joined the queue.",
    });
  };

  const estimatedWaitTime = currentUser ? currentUser.position * 15 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold">QueueHub</h1>
          <p className="text-gray-600">New College Registrar's Office</p>
        </div>

        {currentUser ? (
          <div className="space-y-6">
            <QueueCard
              position={currentUser.position}
              estimatedTime={estimatedWaitTime}
              totalInQueue={queueLength}
            />
            <p className="text-center text-sm text-gray-500 mt-4">
              Please wait to be called. Make sure to have your student ID ready.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <JoinQueueForm onJoin={handleJoinQueue} />
            <p className="text-center text-sm text-gray-500">
              Current estimated wait time: 15-30 minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
