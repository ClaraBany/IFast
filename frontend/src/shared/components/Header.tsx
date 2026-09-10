import { Bell, Menu } from "lucide-react";
import Logo from "@assets/logo-white.png";
import { Ripples } from "react-ripples-continued";

interface HeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ open, setOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 z-10 flex h-20 w-full items-center justify-between bg-primary px-5">
      <button className="icon-btn" onClick={() => setOpen(!open)}>
        <Menu color="white" size={40} />
        <Ripples color="var(--ripple-light)" />
      </button>

      <img src={Logo} alt="Logo" className="h-12 brightness-0 invert" />

      <button className="icon-btn">
        <Bell color="white" size={40} strokeWidth={1.5} />
        <Ripples color="var(--ripple-light)" />
      </button>
    </header>
  );
}
