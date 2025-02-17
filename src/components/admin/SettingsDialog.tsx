
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScheduleSettings {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
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

  const handleSave = () => {
    onMaxQueueSizeChange(tempMaxSize);
    onScheduleChange(tempSchedule);
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
      <DialogContent className="sm:max-w-[425px]">
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
