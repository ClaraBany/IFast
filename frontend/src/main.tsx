import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuthStore } from "@auth/authStore";
import Logo from "@assets/logo-primary.png";

import App from "./App.tsx";
import "@shared/styles.css";
import AuthLayout from "@shared/layouts/AuthLayout.tsx";
import MainLayout from "@shared/layouts/MainLayout";
import Login from "@auth/Login";
import Register from "@auth/Register";
import Offer from "@ride-offer/Offer";
import MyRides from "@my-rides/MyRides";
import Request from "@ride-request/Request";
import Vehicles from "@vehicle/Vehicles";
import { LoaderCircle } from "lucide-react";
import RequireAuth from "@auth/RequireAuth";
import RequireGuest from "@auth/RequireGuest";
import VehicleForm from "./features/vehicle/VehicleForm.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <App /> },
          { path: "/offer", element: <Offer /> },
          { path: "/myrides", element: <MyRides /> },
          { path: "/request", element: <Request /> },
          { path: "/vehicles", element: <Vehicles /> },
          { path: "/vehicles/create", element: <VehicleForm /> },
          { path: "/vehicles/:id/edit", element: <VehicleForm /> },
        ],
      },
    ],
  },
]);

export function AppInitializer() {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="flex-center min-h-dvh flex-col gap-5 bg-neutral-light">
        <img src={Logo} alt="Logo" className="h-22.25" />

        <LoaderCircle color="var(--color-primary)" className="animate-spin" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AppInitializer />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
