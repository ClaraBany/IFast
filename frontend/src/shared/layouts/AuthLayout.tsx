import { Outlet } from "react-router";
import Logo from "@assets/logo-primary.png";
import { useLayoutEffect } from "react";
import { GlobalErrorModal } from "@/shared/components/GlobalErrorModal";

export default function AuthLayout() {
  useLayoutEffect(() => {
    document.documentElement.classList.add("bg-neutral-light");

    return () => {
      document.documentElement.classList.remove("bg-neutral-light");
    };
  }, []);

  return (
    <main className="relative flex-center min-h-screen flex-col gap-5 bg-neutral-light p-5">
      <GlobalErrorModal />

      <img src={Logo} alt="Logo" className="h-22.25" />

      <Outlet />
    </main>
  );
}
