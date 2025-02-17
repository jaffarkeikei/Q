
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface JoinQueueFormProps {
  onJoin: (name: string, studentNumber: string, reason: string) => void;
}

const JoinQueueForm = ({ onJoin }: JoinQueueFormProps) => {
  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const isValidName = (name: string): boolean => {
    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    return nameRegex.test(name.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      toast({
        title: "Error",
        description: "Please provide both first and last name",
        variant: "destructive",
      });
      return;
    }

    // Validate each part of the name
    for (const part of nameParts) {
      if (!isValidName(part)) {
        toast({
          title: "Error",
          description: "Names can only contain letters, hyphens, and apostrophes",
          variant: "destructive",
        });
        return;
      }
    }

    if (!name || !studentNumber || !reason) {
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

    onJoin(name, studentNumber, reason);
    setName("");
    setStudentNumber("");
    setReason("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    const value = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
    setName(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div>
        <Input
          placeholder="Full Name (First and Last)"
          value={name}
          onChange={handleNameChange}
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
      <div>
        <Textarea
          placeholder="Reason for Visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="bg-white/90 border-queue-border resize-none"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full bg-queue-accent hover:bg-queue-accent/90">
        Join Queue
      </Button>
    </form>
  );
};

export default JoinQueueForm;
