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
  const [fetchedCommittees, setCommittees] = useState<any[]>([]);
  const [fetchedCountries, setCountries] = useState<any[]>([]);

  const parties = [
    { name: "BJP", flagPath: "/parties/bjp.png", members: ["narendra modi", "amit shah"] },
    { name: "Congress", flagPath: "/parties/congress.svg", members: ["rahul gandhi", "sashi tharoor"] },
    { name: "AAP", flagPath: "/parties/aap.svg", members: ["arvind kejriwal"] },
    { name: "AITC", flagPath: "/parties/aitc.svg", members: ["mamata banerjee"] },
    { name: "Samajwadi Party", flagPath: "/parties/samajwadi-party.svg", members: ["akhilesh yadav"] },
  ];

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
 
  useEffect(() => {
    const fetchCommitteeCountryData = async () => {
      try {
        const { data: committeesData } = await supabase.from('committees').select('*');
        const { data: countriesData } = await supabase.from('countries').select('*');
        setCommittees(committeesData || []);
        setCountries(countriesData || []);
      } catch (error) {
        console.error('Error fetching committee & country data:', error);
      }
    };
    fetchCommitteeCountryData();
  }, []);

  const handleRegister = () => {
    router.push("/register");
  };  
  

  const sharedGuidelines = (
    <ul className="list-disc pl-5 text-left text-gray-600">
      <li className="mb-1.5">Complete all required fields in your application</li>
      <li className="mb-1.5">Have your ID proof ready for verification</li>
      <li className="mb-1.5">Select your committee preferences wisely</li>
      <li className="mb-1.5">For any queries, contact the secretariat at support@amun25.org</li>
    </ul>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <div className="mb-8 self-start ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Hi {user.name}</h1>
      </div>
      <div className="max-w-2xl md:max-w-xl w-full mx-auto">
        {registrationStatus.isRegistered ? (
          <RegistrationProgress currentStep={isAllocated ? "allocation" : "review"} />
        ) : (              
          <RegistrationProgress currentStep="registration" />         
        )}
      </div>

      {registrationStatus.isRegistered && (
        isAllocated ? (
          <div className="w-full max-w-3xl border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-md mb-2 mt-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-blue-800 mb-5 text-center">Your Allocation Details</h3>
            
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center p-3 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-700">Category</span>
                  </div>
                  <span className="font-semibold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-xl text-center">
                    {allocationData?.[0]?.role === 'delegate'
                      ? 'Delegate'
                      : allocationData?.[0]?.role === 'IP'
                        ? 'International Press'
                        : allocationData?.[0]?.role || 'Not specified'}
                  </span>
                </div>
                
                {allocationData?.[0]?.role === 'IP' ? (
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center p-3 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2 md:mb-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-700">Role</span>
                    </div>
                    <span className="font-semibold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-xl text-center">
                      {allocationData?.[0]?.ip_subrole === 'reporter'
                      ? 'Reporter'
                      : allocationData?.[0]?.ip_subrole === 'photojournalist'
                        ? 'Photojournalist'
                        : allocationData?.[0]?.ip_subrole || 'Not specified'}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center p-3 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-700">Committee</span>
                      </div>
                      <span className="font-semibold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-xl text-center">
                        {allocationData && fetchedCommittees.length > 0 
                          ? (fetchedCommittees.find(c => c.id === allocationData?.[0]?.committee_id)?.name || "Not specified")
                          : "Not specified"
                        }
                      </span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center p-3 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-700">Country/Member</span>
                      </div>

                      <span className="font-semibold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-xl flex items-center w-full md:w-auto justify-center md:justify-start">
                        {(() => {
                          const country = allocationData && fetchedCountries.length > 0
                            ? fetchedCountries.find(c => c.id === allocationData?.[0]?.country_id)
                            : null;
                          const committee = allocationData && fetchedCommittees.length > 0
                            ? fetchedCommittees.find(c => c.id === allocationData?.[0]?.committee_id)
                            : null;

                          if (!country) return "Not specified";
                          
                          const isConstituentAssembly = committee?.name === "Constituent Assembly";
                          const defaultFlag = `/flags/${country.name.toLowerCase()}.svg`;
                          const party = parties.find(p => p.members.includes(country.name.toLowerCase()));
                          const flagPath = isConstituentAssembly ? (party?.flagPath ?? defaultFlag) : defaultFlag;
                          
                          return <>
                            <img src={flagPath} alt="flag" className="w-6 mr-2 inline-block rounded-sm" />
                            {country.name}
                          </>;
                        })()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-yellow-50 p-4 border border-yellow-200 rounded-lg shadow-sm mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-6 md:w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-yellow-800 font-medium">
              Your application is under review. Allocation results will be announced soon.
            </p>
          </div>
        )
      )}

      <div className="w-full px-4 md:px-8 lg:px-16 mt-8">
        {registrationStatus.isRegistered ? (
          isAllocated ? (
            <div className="max-w-full p-6 border border-gray-200 rounded-lg bg-white text-sm shadow-sm">
              <p className="text-gray-700 mb-3 font-medium">Delegate Guidelines:</p>
              <ul className="list-disc pl-5 text-left text-gray-600">
                <li className="mb-1.5">Research your allocated country's position thoroughly</li>
                <li className="mb-1.5">Prepare position papers according to committee guidelines</li>
                <li className="mb-1.5">Attend all scheduled committee sessions</li>
                <li className="mb-1.5">Remember to follow the dress code during the event</li>
                <li className="mb-1.5">Submit your position papers by the designated deadline</li>
              </ul>
            </div>
          ) : (
            <div className="max-w-full p-6 border border-gray-200 rounded-lg bg-white text-sm shadow-sm">
              <p className="text-gray-700 mb-3 font-medium">Guidelines:</p>
              {sharedGuidelines}
            </div>
          )
        ) : (
          <>
          <div className="max-w-full p-6 border border-gray-200 rounded-lg bg-white text-sm shadow-sm">
            <p className="text-gray-700 mb-3 font-medium">Guidelines:</p>
            {sharedGuidelines}
          </div>
          <div className="flex flex-col items-center w-full text-center">
              <Button 
                onClick={handleRegister}
                className="cursor-pointer bg-[#00B7FF] hover:bg-blue-600 text-white font-medium px-10 py-3 rounded-md shadow-sm transition-all hover:shadow mt-6"
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
