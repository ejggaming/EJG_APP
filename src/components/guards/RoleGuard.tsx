import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

/**
 * Protects routes by checking if user is authenticated and has an allowed role.
 * Redirects unauthenticated users to /login and unauthorized users to their home.
 */
export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { isAuthenticated, user } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role.toUpperCase();

  if (!allowedRoles.map((r) => r.toUpperCase()).includes(userRole)) {
    // Redirect to the user's appropriate home based on role
    const roleHome = getRoleHome(userRole);
    return <Navigate to={roleHome} replace />;
  }

  return <>{children}</>;
}

/** Returns the home route for a given role */
export function getRoleHome(role: string): string {
  switch (role.toUpperCase()) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin";
    case "AGENT":
      return "/agent";
    case "PLAYER":
    default:
      return "/";
  }
}
