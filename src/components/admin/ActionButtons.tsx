
import { Button } from "@/components/ui/button";
import { Download, Play, Pause } from "lucide-react";
import { AddStudentDialog } from "./AddStudentDialog";
import { SettingsDialog } from "./SettingsDialog";
import { ScheduleSettings } from "@/types/queue";

interface ActionButtonsProps {
  isQueueOpen: boolean;
  toggleQueue: () => void;
  newStudent: {
    name: string;
    studentNumber: string;
    reason: string;
  };
  onNewStudentChange: (student: { name: string; studentNumber: string; reason: string }) => void;
  onAddStudent: () => void;
  maxQueueSize: number;
  onMaxQueueSizeChange: (size: number) => void;
  schedule: ScheduleSettings;
  onScheduleChange: (schedule: ScheduleSettings) => void;
  onExportCSV: () => void;
  onLogout: () => void;
}

export const ActionButtons = ({
  isQueueOpen,
  toggleQueue,
  newStudent,
  onNewStudentChange,
  onAddStudent,
  maxQueueSize,
  onMaxQueueSizeChange,
  schedule,
  onScheduleChange,
  onExportCSV,
  onLogout,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={isQueueOpen ? "destructive" : "outline"}
        onClick={toggleQueue}
        className="flex items-center gap-2"
      >
        {isQueueOpen ? (
          <>
            <Pause className="h-4 w-4" />
            Stop Queue
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Start Queue
          </>
        )}
      </Button>
      <AddStudentDialog
        newStudent={newStudent}
        onNewStudentChange={onNewStudentChange}
        onAddStudent={onAddStudent}
      />
      <SettingsDialog
        maxQueueSize={maxQueueSize}
        onMaxQueueSizeChange={onMaxQueueSizeChange}
        schedule={schedule}
        onScheduleChange={onScheduleChange}
      />
      <Button
        variant="outline"
        onClick={onExportCSV}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
      <Button
        variant="outline"
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  );
};
