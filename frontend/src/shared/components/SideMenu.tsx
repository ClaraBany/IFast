import { CircleUserRound, Car, RotateCcwClock, RefreshCcw, Plus, LayoutDashboard, LogOut } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import { Link } from "react-router";
import { Drawer } from "vaul";

interface SideMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideMenu({ open, setOpen }: SideMenuProps) {
  return (
    <Drawer.Root direction="left" open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[1.5px]" />
        <Drawer.Content className="fixed top-0 bottom-0 left-0 my-20 flex w-[320px] rounded-e-2xl bg-white">
          <div className="flex-column w-full items-start gap-5 p-6">
            <Link to={""} className="flex-center gap-2.5">
              <CircleUserRound size={55} strokeWidth={1} />
              <h3>Usuário</h3>
            </Link>

            <Link to={""} className="btn btn-lg justify-start bg-neutral-light text-slate-900">
              <Car />
              Meus veículos
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-lg justify-start bg-neutral-light text-slate-900">
              <RotateCcwClock />
              Histórico de Caronas
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-lg justify-start bg-neutral-light text-slate-900">
              <RefreshCcw />
              Ofertas Recorrentes
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-lg justify-start bg-neutral-light text-slate-900">
              <Plus />
              Criar Oferta
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-lg justify-start bg-neutral-light text-slate-900">
              <Plus />
              Criar Pedido
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-lg justify-start bg-neutral-light text-slate-900">
              <LayoutDashboard />
              Dashboard
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <Link to={""} className="btn btn-lg mt-auto justify-start bg-danger/20 text-danger">
              <LogOut />
              Sair
              <Ripples color="var(--ripple-dark)" />
            </Link>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
