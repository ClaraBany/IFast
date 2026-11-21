import { UserRole } from "@user/userTypes";
import { useAuthStore } from "./authStore";
import { Navigate, Outlet } from "react-router";

export default function RequireAdmin() {
  const user = useAuthStore((state) => state.user);

  if (user?.role === UserRole.ADMIN) {
    return <Outlet />;
  }

  return <Navigate to={"/offers"} replace />;
}