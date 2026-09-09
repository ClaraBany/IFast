import Header from "@shared/components/Header";
import NavBar from "@shared/components/NavBar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <main className="relative min-h-screen py-26">
      <Header />

      <div className="container mx-auto px-5 2xl:px-30">
        <Outlet />
      </div>

      <NavBar />
    </main>
  );
}
