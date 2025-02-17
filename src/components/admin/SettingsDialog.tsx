
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SettingsDialogProps {
  maxQueueSize: number;
  onMaxQueueSizeChange: (size: number) => void;
}

export const SettingsDialog = ({
  maxQueueSize,
  onMaxQueueSizeChange,
}: SettingsDialogProps) => {
  const [tempMaxSize, setTempMaxSize] = useState(maxQueueSize);

  const handleSave = () => {
    onMaxQueueSizeChange(tempMaxSize);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Queue Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
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
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
