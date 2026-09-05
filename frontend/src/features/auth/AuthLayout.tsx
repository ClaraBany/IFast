import { Outlet } from "react-router";
import Logo from "@assets/logo-primary.png";

export default function AuthLayout() {
  return (
    <main className="flex-center min-h-screen flex-col gap-5">
      <img src={Logo} alt="Logo" className="h-22.25" />

      <Outlet />
    </main>
  );
}
