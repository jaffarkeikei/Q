
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface JoinQueueFormProps {
  onJoin: (name: string, studentNumber: string) => void;
}

const JoinQueueForm = ({ onJoin }: JoinQueueFormProps) => {
  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !studentNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (studentNumber.length !== 10) {
      toast({
        title: "Error",
        description: "Student number must be 10 digits",
        variant: "destructive",
      });
      return;
    }

    onJoin(name, studentNumber);
    setName("");
    setStudentNumber("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div>
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/90 border-queue-border"
        />
      </div>
      <div>
        <Input
          placeholder="Student Number (10 digits)"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
          className="bg-white/90 border-queue-border"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      <Button type="submit" className="w-full bg-queue-accent hover:bg-queue-accent/90">
        Join Queue
      </Button>
    </form>
  );
};

export default JoinQueueForm;
