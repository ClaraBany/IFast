import { useAuthStore } from "./authStore";
import { Navigate, Outlet, useLocation, type Location } from "react-router";

export default function RequireGuest() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (user) {
    const { from } = (location.state as { from?: Location }) ?? {};

    return <Navigate to={from ?? "/offer"} replace />;
  }

  return <Outlet />;
}
