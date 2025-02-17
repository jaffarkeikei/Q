
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Clock, X } from "lucide-react";

interface QueueItemProps {
  id: number;
  name: string;
  studentNumber: string;
  reason: string;
  joinedAt: Date;
  onRemove: (id: number) => void;
}

export const QueueItemCard = ({
  id,
  name,
  studentNumber,
  reason,
  joinedAt,
  onRemove,
}: QueueItemProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">{name}</h3>
            <span className="text-sm text-gray-500">({studentNumber})</span>
          </div>
          <p className="text-sm text-gray-600">{reason}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Joined: {new Date(joinedAt).toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemove(id)}
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};
