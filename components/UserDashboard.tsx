import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

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
  const [isAllocated, setIsAllocated] = useState(false);
  const [allocationData, setAllocationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllocation = async () => {
      setIsLoading(true);
      
      try {
        const { data: allocationData, error: fetchAllocationError } = await supabase
          .from('allocations')
          .select('*')
          .eq('user_id', user.id)

          if (fetchAllocationError || !allocationData) throw fetchAllocationError;
          
        if (allocationData.length === 1) setIsAllocated(true);
        setAllocationData(allocationData);
      } catch (error) {
        console.error("Fetching Allocation error:", error);
      } finally {
        setIsLoading(false);
      }
    } ;

    fetchAllocation();
  }, [user])
 
  const handleRegister = () => {
    router.push("/register");
  };  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Hi {user.name}</h1>
      </div>
      
      <div className="max-w-md w-full mx-auto">
        {registrationStatus.isRegistered ? (          <div className="flex items-center justify-center bg-green-50 p-4 border border-green-200 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-medium">
              Registration for AMUN 2025 Completed
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full text-center">
            <div className="mb-5 p-5 border border-blue-100 rounded-lg bg-blue-50 w-full text-sm shadow-sm">
              <p className="text-gray-700 mb-3 font-medium">Registration Guidelines:</p>
              <ul className="list-disc pl-5 text-left text-gray-600">
                <li className="mb-1.5">Complete all required fields</li>
                <li className="mb-1.5">Have your ID proof ready to upload</li>
                <li className="mb-1.5">Select your committee preferences wisely</li>
              </ul>
            </div>
            <Button 
              onClick={handleRegister}
              className="cursor-pointer bg-[#00B7FF] hover:bg-blue-600 text-white font-medium px-10 py-3 rounded-md shadow-sm transition-all hover:shadow"
            >
              Complete Registration
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
