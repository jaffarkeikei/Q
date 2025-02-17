
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";

interface NewStudent {
  name: string;
  studentNumber: string;
  reason: string;
}

interface AddStudentDialogProps {
  newStudent: NewStudent;
  onNewStudentChange: (student: NewStudent) => void;
  onAddStudent: () => void;
}

export const AddStudentDialog = ({
  newStudent,
  onNewStudentChange,
  onAddStudent,
}: AddStudentDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student to Queue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Full Name"
            value={newStudent.name}
            onChange={(e) => onNewStudentChange({ ...newStudent, name: e.target.value })}
          />
          <Input
            placeholder="Student Number (10 digits)"
            value={newStudent.studentNumber}
            onChange={(e) => onNewStudentChange({
              ...newStudent,
              studentNumber: e.target.value.replace(/\D/g, "").slice(0, 10)
            })}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <Textarea
            placeholder="Reason for Visit"
            value={newStudent.reason}
            onChange={(e) => onNewStudentChange({ ...newStudent, reason: e.target.value })}
            className="resize-none"
            rows={3}
          />
          <Button onClick={onAddStudent} className="w-full">
            Add to Queue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
