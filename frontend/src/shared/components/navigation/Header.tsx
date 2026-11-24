import { Bell, Menu } from "lucide-react";
import Logo from "@assets/logo-primary.svg";
import { Ripples } from "react-ripples-continued";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "@notification/notificationService";

interface HeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ open, setOpen }: HeaderProps) {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "count"],
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
  });

  return (
    <header className="fixed top-0 left-0 z-10 flex h-16 w-full items-center justify-between bg-primary px-5">
      <button className="icon-btn p-3" onClick={() => setOpen(!open)}>
        <Menu color="white" size={24} />
        <Ripples color="var(--ripple-light)" />
      </button>

      <Link to={"/offers"}>
        <img src={Logo} alt="Logo" className="h-8 brightness-0 invert" />
      </Link>

      <div className="relative">
        <Link
          to="/notifications"
          className="icon-btn relative p-3"
          aria-label={unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : "Notificações"}
        >
          <Bell color="white" size={24} strokeWidth={1.5} />
          <Ripples color="var(--ripple-light)" />
        </Link>
        {unreadCount > 0 && (
          <span className="pointer-events-none absolute top-1.5 left-5.75 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-primary bg-pending px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
    </header>
  );
}
