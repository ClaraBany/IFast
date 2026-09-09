import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App.tsx";
import "@shared/styles.css";
import AuthLayout from "@auth/AuthLayout";
import MainLayout from "@shared/layouts/MainLayout";
import Login from "@auth/Login";
import Register from "@auth/Register";
import Offer from "@ride-offer/Offer";
import MyRides from "@my-rides/MyRides";
import Request from "@ride-request/Request";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/offer", element: <Offer /> },
      { path: "/myrides", element: <MyRides /> },
      { path: "/request", element: <Request /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
