import { RequireAccessLevel } from "~/lib/auth";

export default function AdminDashboard() {
  return (
    <RequireAccessLevel level="ADMIN">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
    </RequireAccessLevel>
  );
}
