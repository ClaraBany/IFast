import { useAuthStore } from "@auth/authStore";
import { CircleUserRound, Car, RotateCcwClock, RefreshCcw, Plus, LayoutDashboard, LogOut } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import { Link } from "react-router";
import { Drawer } from "vaul";

interface SideMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideMenu({ open, setOpen }: SideMenuProps) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <Drawer.Root direction="left" open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[1.5px]" />
        <Drawer.Content className="fixed top-0 bottom-0 left-0 my-20 flex w-[320px] rounded-e-2xl bg-white">
          <div className="flex-column w-full items-start gap-5 overflow-y-auto p-6">
            <Link to={`/user/${user!.id}`} onClick={() => setOpen(false)} className="flex-center gap-2.5">
              {user?.pictureUrl ? (
                <img src={user.pictureUrl} className="size-13.75 rounded-full" />
              ) : (
                <CircleUserRound size={55} strokeWidth={1} />
              )}
              <h3>{user?.name ?? "Usuário"}</h3>
            </Link>

            <Link to={"/vehicles"} className="btn btn-side-menu" onClick={() => setOpen(false)}>
              <Car />
              Meus veículos
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-side-menu" onClick={() => setOpen(false)}>
              <RotateCcwClock />
              Histórico de Caronas
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-side-menu" onClick={() => setOpen(false)}>
              <RefreshCcw />
              Ofertas Recorrentes
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-side-menu" onClick={() => setOpen(false)}>
              <Plus />
              Criar Oferta
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-side-menu" onClick={() => setOpen(false)}>
              <Plus />
              Criar Pedido
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-side-menu" onClick={() => setOpen(false)}>
              <LayoutDashboard />
              Dashboard
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <button onClick={logout} className="btn btn-side-menu mt-auto bg-danger/20 text-danger">
              <LogOut />
              Sair
              <Ripples color="var(--ripple-dark)" />
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
