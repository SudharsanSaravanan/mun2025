interface UserData {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  is_internal: boolean;
  is_admin: boolean;
  created_at: string;
}

interface AdminDashboardProps {
  user: UserData;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="pt-4">
      <p>Admin Dashboard</p>
    </div>
  );
}
