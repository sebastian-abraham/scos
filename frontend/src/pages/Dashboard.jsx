import { useAuth } from "../context/AuthContext";
import ManagerDashboard from "./manager/ManagerDashboard";
import ShopkeeperDashboard from "./shopkeeper/ShopkeeperDashboard";
import StudentDashboard from "./student/StudentDasboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "manager") {
    return <ManagerDashboard user={user} />;
  }
  if (user.role === "shopkeeper") {
    return <ShopkeeperDashboard user={user} />;
  }
  if (user.role === "student") {
    return <StudentDashboard user={user} />;
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard</h1>
      <p>
        <strong>Name:</strong> {user.firstName} {user.lastName}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}
