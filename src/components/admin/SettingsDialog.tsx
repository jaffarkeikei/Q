import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Advisor {
  id: string;
  name: string;
  isAvailable: boolean;
  roomNumber: string;
}

interface ScheduleSettings {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  timePerStudent: number; // in minutes
  advisors: Advisor[];
}

interface SettingsDialogProps {
  maxQueueSize: number;
  onMaxQueueSizeChange: (size: number) => void;
  schedule: ScheduleSettings;
  onScheduleChange: (schedule: ScheduleSettings) => void;
}

export const SettingsDialog = ({
  maxQueueSize,
  onMaxQueueSizeChange,
  schedule,
  onScheduleChange,
}: SettingsDialogProps) => {
  const [tempMaxSize, setTempMaxSize] = useState(maxQueueSize);
  const [tempSchedule, setTempSchedule] = useState<ScheduleSettings>(schedule);
  const [newAdvisorName, setNewAdvisorName] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    onMaxQueueSizeChange(tempMaxSize);
    onScheduleChange(tempSchedule);
    toast({
      title: "Settings saved",
    });
  };

  const addAdvisor = () => {
    if (!newAdvisorName.trim() || !newRoomNumber.trim()) return;
    
    setTempSchedule(prev => ({
      ...prev,
      advisors: [
        ...prev.advisors,
        {
          id: crypto.randomUUID(),
          name: newAdvisorName.trim(),
          roomNumber: newRoomNumber.trim(),
          isAvailable: true
        }
      ]
    }));
    setNewAdvisorName("");
    setNewRoomNumber("");
  };

  const removeAdvisor = (id: string) => {
    setTempSchedule(prev => ({
      ...prev,
      advisors: prev.advisors.filter(advisor => advisor.id !== id)
    }));
  };

  const toggleAdvisorAvailability = (id: string) => {
    setTempSchedule(prev => ({
      ...prev,
      advisors: prev.advisors.map(advisor =>
        advisor.id === id ? { ...advisor, isAvailable: !advisor.isAvailable } : advisor
      )
    }));
  };

  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Queue Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="maxSize">Maximum Queue Size</Label>
            <Input
              id="maxSize"
              type="number"
              min="1"
              value={tempMaxSize}
              onChange={(e) => setTempMaxSize(Math.max(1, parseInt(e.target.value) || 1))}
              placeholder="Enter maximum number of students"
            />
            <p className="text-sm text-gray-500">
              Queue will automatically stop accepting new students when this limit is reached
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Queue Schedule</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select
                  value={tempSchedule.dayOfWeek}
                  onValueChange={(value) => setTempSchedule({ ...tempSchedule, dayOfWeek: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={tempSchedule.startTime}
                    onChange={(e) => setTempSchedule({ ...tempSchedule, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={tempSchedule.endTime}
                    onChange={(e) => setTempSchedule({ ...tempSchedule, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timePerStudent">Time Per Student (minutes)</Label>
                <Input
                  id="timePerStudent"
                  type="number"
                  min="1"
                  value={tempSchedule.timePerStudent}
                  onChange={(e) => setTempSchedule({
                    ...tempSchedule,
                    timePerStudent: Math.max(1, parseInt(e.target.value) || 1)
                  })}
                  placeholder="Enter time per student in minutes"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Advisors</h4>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Enter advisor name"
                    value={newAdvisorName}
                    onChange={(e) => setNewAdvisorName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAdvisor()}
                  />
                  <Input
                    placeholder="Enter room number"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAdvisor()}
                  />
                </div>
                <Button onClick={addAdvisor} size="sm" className="h-auto">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {tempSchedule.advisors.map((advisor) => (
                  <div
                    key={advisor.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex flex-col mr-2">
                      <span className="font-medium truncate">{advisor.name}</span>
                      <span className="text-sm text-gray-500">Room {advisor.roomNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant={advisor.isAvailable ? "default" : "secondary"}
                        size="sm"
                        onClick={() => toggleAdvisorAvailability(advisor.id)}
                      >
                        {advisor.isAvailable ? "Available" : "Unavailable"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAdvisor(advisor.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
