'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {  
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace('/');
    }
  };

  return (
    <div>
      <p>Dashboard</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
