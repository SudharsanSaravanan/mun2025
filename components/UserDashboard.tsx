import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { RegistrationProgress } from "@/components/RegistrationProgress";

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
  };  
  
  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <div className="mb-8 self-start ml-4 md:ml-8">
        <h1 className="text-3xl font-bold text-gray-900">Hi {user.name}</h1>
      </div>
        <div className="max-w-md w-full mx-auto">{registrationStatus.isRegistered ? (
          <>
            
            <RegistrationProgress 
              currentStep={isAllocated ? "allocation" : "review"} 
            />
              {isAllocated ? (
              <>
                <div className="flex items-center justify-center bg-green-50 p-4 border border-green-200 rounded-lg shadow-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">
                    Your allocation is complete
                  </p>
                </div>

             
                <div className="w-full border border-blue-200 rounded-lg bg-blue-50 p-5 shadow-sm mb-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-3 text-center">Your Allocation Details</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="font-medium text-blue-700">{allocationData?.[0]?.category || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium text-gray-700">Committee:</span>
                      <span className="font-medium text-blue-700">{allocationData?.[0]?.committee || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium text-gray-700">Country:</span>
                      <span className="font-medium text-blue-700">{allocationData?.[0]?.country || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                {/* Allocation Guidelines */}
                <div className="mt-4 p-5 border border-green-100 rounded-lg bg-green-50 w-full text-sm shadow-sm">
                  <p className="text-gray-700 mb-3 font-medium">Delegate Guidelines:</p>
                  <ul className="list-disc pl-5 text-left text-gray-600">
                    <li className="mb-1.5">Research your allocated country's position thoroughly</li>
                    <li className="mb-1.5">Prepare position papers according to committee guidelines</li>
                    <li className="mb-1.5">Attend all scheduled committee sessions</li>
                    <li className="mb-1.5">Remember to follow the dress code during the event</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center bg-green-50 p-4 border border-green-200 rounded-lg shadow-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">
                    Registration for AMUN 2025 Completed
                  </p>
                </div>
                
                <div className="flex items-center justify-center bg-yellow-50 p-4 border border-yellow-200 rounded-lg shadow-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-yellow-800 font-medium">
                    Your application is under review. Allocation results will be announced soon.
                  </p>
                </div>

                {/* Review Guidelines */}
                <div className="mt-4 p-5 border border-yellow-100 rounded-lg bg-yellow-50 w-full text-sm shadow-sm">
                  <p className="text-gray-700 mb-3 font-medium">Review Process Guidelines:</p>
                  <ul className="list-disc pl-5 text-left text-gray-600">
                    <li className="mb-1.5">The review process typically takes 3-5 working days</li>
                    <li className="mb-1.5">Our team evaluates committee preferences and assigns allocations</li>
                    <li className="mb-1.5">You will receive an email notification once allocations are finalized</li>
                    <li className="mb-1.5">For any queries regarding your application, contact the secretariat</li>
                  </ul>
                </div>
              </>
            )}
          </>
        ) : (              <>
                <RegistrationProgress currentStep="registration" />
                
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
              </>
            
        )}
      
      </div>
    </div>
  );
}
