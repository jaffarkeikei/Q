
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Clock, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QueueItemProps {
  id: number;
  name: string;
  studentNumber: string;
  reason: string;
  joinedAt: Date;
  position: number;
  estimatedWaitTime?: number;
  assignedAdvisor?: string;
  availableAdvisors: { name: string; isAvailable: boolean }[];
  onRemove: (id: number) => void;
  onChangeAdvisor: (id: number, newAdvisor: string) => void;
}

export const QueueItemCard = ({
  id,
  name,
  studentNumber,
  reason,
  joinedAt,
  position,
  estimatedWaitTime,
  assignedAdvisor,
  availableAdvisors,
  onRemove,
  onChangeAdvisor,
}: QueueItemProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
              {position}
            </span>
            <User className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium">{name}</h3>
            <span className="text-sm text-gray-500">({studentNumber})</span>
          </div>
          <p className="text-sm text-gray-600">{reason}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Joined: {new Date(joinedAt).toLocaleTimeString()}</span>
            </div>
            {estimatedWaitTime !== undefined && (
              <span className="text-blue-600">
                Est. Wait: ~{estimatedWaitTime} minutes
              </span>
            )}
            <div className="flex items-center gap-2">
              <Select
                value={assignedAdvisor}
                onValueChange={(value) => onChangeAdvisor(id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select advisor" />
                </SelectTrigger>
                <SelectContent>
                  {availableAdvisors.map((advisor) => (
                    <SelectItem 
                      key={advisor.name} 
                      value={advisor.name}
                      disabled={!advisor.isAvailable && advisor.name !== assignedAdvisor}
                    >
                      {advisor.name} {!advisor.isAvailable && advisor.name !== assignedAdvisor && " (Unavailable)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
