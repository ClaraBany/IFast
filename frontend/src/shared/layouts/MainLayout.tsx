import Header from "@shared/components/Header";
import NavBar from "@shared/components/NavBar";
import SideMenu from "@shared/components/SideMenu";
import { useState } from "react";
import { Outlet } from "react-router";
import { GlobalErrorModal } from "@/shared/components/GlobalErrorModal";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-neutral-light py-26">
      <GlobalErrorModal />

      <Header open={open} setOpen={setOpen} />

      <SideMenu open={open} setOpen={setOpen} />

      <main className="container mx-auto flex-column gap-7.5 px-5 2xl:px-30">
        <Outlet />
      </main>

      <NavBar />
    </div>
  );
}
