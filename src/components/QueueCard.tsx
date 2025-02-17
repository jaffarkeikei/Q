
import { Timer, Users } from "lucide-react";
import { Card } from "./ui/card";

interface QueueCardProps {
  position: number;
  estimatedTime: number;
  totalInQueue: number;
}

const QueueCard = ({ position, estimatedTime, totalInQueue }: QueueCardProps) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-white/90 border-queue-border shadow-lg animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Position</h3>
          <span className="text-3xl font-bold text-queue-accent">{position}</span>
        </div>
        
        <div className="h-2 bg-queue-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-queue-accent transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, (1 - position/totalInQueue) * 100))}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Estimated Wait</p>
              <p className="font-semibold">{estimatedTime} min</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total in Queue</p>
              <p className="font-semibold">{totalInQueue}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QueueCard;
