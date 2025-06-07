import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface UserData {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  is_internal: boolean;
  is_admin: boolean;
  created_at: string;
}

interface RegistrationStatus {
  isRegistered: boolean;
  registrationData?: any;
}

interface UserDashboardProps {
  user: UserData;
  registrationStatus: RegistrationStatus;
}

export default function UserDashboard({ user, registrationStatus }: UserDashboardProps) {
  const router = useRouter();
  
  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="max-w-md">
        {registrationStatus.isRegistered ? (
          <div>
            <p className="text-gray-800">
              Registration for AMUN 2025 Completed
            </p>
          </div>
        ) : (
          <div>
            <Button 
              onClick={handleRegister}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            >
              Complete Registration
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
