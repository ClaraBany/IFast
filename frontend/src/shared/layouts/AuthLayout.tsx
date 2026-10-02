import { Outlet } from "react-router";
import Logo from "@assets/logo-primary.svg";
import { GlobalErrorModal } from "@shared/components/GlobalErrorModal";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function AuthLayout() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <main className="relative flex-center min-h-screen flex-col gap-5 bg-neutral-light p-5">
        <GlobalErrorModal />

        <img src={Logo} alt="Logo" className="h-22.25" />

        <Outlet />
      </main>
    </GoogleOAuthProvider>
  );
}
