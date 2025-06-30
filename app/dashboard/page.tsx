"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { Loader2 } from "lucide-react";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";

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

export default function DashboardPage() {  
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>({ isRegistered: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      
      if (!authUser?.user) {
        router.replace("/login");
        return;
      }

      if (authError) {
        console.error("Authentication error occurred:", authError);
        router.replace("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.user.id)
        .single();

      if (userError) {
        throw new Error("Error fetching user data: " + userError.message);
      }

      if (!userData) {
        throw new Error("User data not found");
      }

      setUser(userData);
      await checkRegistrationStatus(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async (userData: UserData) => {
    try {
      if (userData.is_internal) {
        const { data: internalReg, error: internalError } = await supabase
          .from("internal_registrations")
          .select("*")
          .eq("user_id", userData.id);        
        
        if (internalError) {
          throw new Error("Error checking internal registration: " + internalError.message);
        }

        const isRegistered = !!(internalReg && internalReg.length > 0);
        setRegistrationStatus({
          isRegistered,
          registrationData: isRegistered ? internalReg[0] : null
        });
      } else {
        const { data: externalReg, error: externalError } = await supabase
          .from("external_registrations")
          .select("*")
          .eq("user_id", userData.id);
        
        if (externalError) {
          throw new Error("Error checking external registration: " + externalError.message);
        }

        const isRegistered = !!(externalReg && externalReg.length > 0);
        setRegistrationStatus({
          isRegistered,
          registrationData: isRegistered ? externalReg[0] : null
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error checking registration status");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace("/");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-14 w-14 animate-spin text-blue-600 mx-auto" />
          <p className="mt-3 text-gray-800 text-md">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 max-w-lg">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 text-sm">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (    <div className="min-h-screen bg-blue-50">
      <DashboardNavbar onLogout={handleLogout} />      
      <div className="pt-20 pb-10 px-4 md:px-6">
        <div className=" mx-auto">
          {user && (
            <>
              {user.is_admin ? (
                <AdminDashboard user={user} />           
              ) : (
                <UserDashboard 
                  user={user} 
                  registrationStatus={registrationStatus} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
