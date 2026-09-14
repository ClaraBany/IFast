import { useAuthStore } from "./authStore";
import { Navigate, Outlet, useLocation } from "react-router";

export default function RequireAuth() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (user) {
    return <Outlet />;
  }

  return <Navigate to={"/login"} state={{ from: location }} replace />;
}
