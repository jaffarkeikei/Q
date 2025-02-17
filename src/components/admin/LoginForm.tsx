import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
interface LoginFormProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}
export const LoginForm = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}: LoginFormProps) => {
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            Student Login
          </Link>
          <p className="text-gray-500">Enter your credentials to manage the queue</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input placeholder="admin" value={username} onChange={e => onUsernameChange(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Input type="password" placeholder="123" value={password} onChange={e => onPasswordChange(e.target.value)} />
          </div>
          <Button type="submit" className="w-full font-normal bg-green-900 hover:bg-green-800">
            Login
          </Button>
        </form>
      </Card>
    </div>;
};