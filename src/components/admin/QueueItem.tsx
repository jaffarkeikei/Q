
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
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium shrink-0">
              {position}
            </span>
            <User className="h-4 w-4 text-gray-500 shrink-0" />
            <h3 className="font-medium truncate">{name}</h3>
            <span className="text-sm text-gray-500 shrink-0">({studentNumber})</span>
          </div>
          <p className="text-sm text-gray-600 truncate">{reason}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <div className="flex items-center gap-2 shrink-0">
              <Clock className="h-4 w-4" />
              <span>Joined: {new Date(joinedAt).toLocaleTimeString()}</span>
            </div>
            {estimatedWaitTime !== undefined && (
              <span className="text-blue-600 shrink-0">
                Est. Wait: ~{estimatedWaitTime} minutes
              </span>
            )}
            <div className="flex items-center gap-2 shrink-0">
              <Select
                value={assignedAdvisor}
                onValueChange={(value) => onChangeAdvisor(id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select advisor" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
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
        <div className="flex items-center gap-2 ml-4 shrink-0">
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
