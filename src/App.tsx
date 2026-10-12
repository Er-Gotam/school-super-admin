import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { SchoolsPage } from "./pages/schools/SchoolsPage";
import { SchoolDetailsPage } from "./pages/schools/SchoolDetailsPage";
import { PlansPage } from "./pages/plans/PlansPage";
import { SubscriptionsPage } from "./pages/subscriptions/SubscriptionsPage";
import { AuditLogsPage } from "./pages/audit-logs/AuditLogsPage";
import { ProfileSecurityPage } from "./pages/profile/ProfileSecurityPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  return localStorage.getItem("super_admin_token") ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
    <Route path="/schools" element={<RequireAuth><SchoolsPage /></RequireAuth>} />
    <Route path="/schools/:schoolId" element={<RequireAuth><SchoolDetailsPage /></RequireAuth>} />
    <Route path="/plans" element={<RequireAuth><PlansPage /></RequireAuth>} />
    <Route path="/subscriptions" element={<RequireAuth><SubscriptionsPage /></RequireAuth>} />
    <Route path="/audit-logs" element={<RequireAuth><AuditLogsPage /></RequireAuth>} />
    <Route path="/profile" element={<RequireAuth><ProfileSecurityPage /></RequireAuth>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}