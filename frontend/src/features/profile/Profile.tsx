import BackButton from "@shared/components/BackButton";
import { useAuthStore } from "@auth/authStore";
import { Link, useParams } from "react-router";
import { CircleUserRound, SquarePen } from "lucide-react";
import { Ripples } from "react-ripples-continued";

export default function Profile() {
  const user = useAuthStore((state) => state.user);

  const { userId } = useParams();

  return (
    <main className="flex-column flex-1 gap-7.5">
      <section className="flex-center w-full justify-between">
        <div className="flex-center gap-2.5">
          <BackButton />

          <h2>Perfil</h2>
        </div>

        {user?.id == userId && (
          <Link to={"/user/updateProfile"} className="icon-btn">
            <SquarePen className="text-secondary" size={24} />
            <Ripples color="var(--ripple-dark)" />
          </Link>
        )}
      </section>

      <div className="flex-column items-center gap-1.5">
        <CircleUserRound size={120} strokeWidth={1} />
        <h3>{user?.name ?? "Usuário"}</h3>
      </div>

      <section className="flex-column w-full gap-2.5">
        <h3>Caronas</h3>

        <div className="flex-center gap-4 text-center text-button text-white">
          <div className="flex-center rounded-lg bg-secondary p-2">
            <span>
              15
              <br />
              Motorista
            </span>
          </div>

          <div className="flex-center rounded-lg bg-secondary p-2">
            <span>
              15
              <br />
              Passageiro
            </span>
          </div>
        </div>
      </section>

      <section className="flex-column w-full gap-2.5">
        <h3>Dados Pessoais</h3>

        <div className="flex-column w-full gap-2.5 rounded-2xl bg-white px-6 py-4">
          <p>
            <span className="text-label">Email: </span>
            {user?.email}
          </p>
          <p>
            <span className="text-label">Contato: </span>(33) 99081-1611
          </p>
        </div>
      </section>
    </main>
  );
}
