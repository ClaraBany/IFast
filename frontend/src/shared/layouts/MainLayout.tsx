import { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { GlobalErrorModal } from "@shared/components/modals/GlobalErrorModal";
import Header from "@shared/components/navigation/Header";
import SideMenu from "@shared/components/navigation/SideMenu";
import NavBar from "@shared/components/navigation/NavBar";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-neutral-light py-22">
      <GlobalErrorModal />

      <Header open={open} setOpen={setOpen} />

      <SideMenu open={open} setOpen={setOpen} />

      <main className="container mx-auto flex-column gap-7.5 px-5 2xl:px-30">
        <Outlet />
        <ScrollRestoration />
      </main>

      <NavBar />
    </div>
  );
}
