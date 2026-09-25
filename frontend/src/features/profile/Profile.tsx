import BackButton from "@shared/components/BackButton";
import { useAuthStore } from "@auth/authStore";
import { Link, useParams } from "react-router";
import { CircleUserRound, LoaderCircle, SquarePen } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import { getProfile } from "./profileService";
import { useQuery } from "@tanstack/react-query";
import RetryError from "@/shared/components/RetryError";

export default function Profile() {
  const authUser = useAuthStore((state) => state.user);
  const { userId } = useParams();

  const {
    data: profile,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(Number(userId)),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (isError || !profile) {
    return <RetryError onRetry={refetch} isFetching={isFetching} />;
  }

  return (
    <>
      <header className="flex-center w-full justify-between">
        <div className="flex-center gap-2.5">
          <BackButton />

          <h2>Perfil</h2>
        </div>

        {authUser?.id == userId && (
          <Link to={"/user/updateProfile"} className="icon-btn">
            <SquarePen className="text-secondary" size={24} />
            <Ripples color="var(--ripple-dark)" />
          </Link>
        )}
      </header>

      <section className="flex-column items-center gap-1.5">
        {profile.user.pictureUrl ? (
          <img src={profile.user.pictureUrl} className="size-30 rounded-full" />
        ) : (
          <CircleUserRound size={120} strokeWidth={1} />
        )}
        <h3>{profile.user.name}</h3>
      </section>

      <section className="flex-column w-full gap-2.5">
        <h3>Caronas</h3>

        <div className="flex-center gap-4 text-center text-button text-white">
          <div className="flex-center rounded-lg bg-secondary p-2">
            <span>
              {profile.ridesAsDriverCount ?? 0}
              <br />
              Motorista
            </span>
          </div>

          <div className="flex-center rounded-lg bg-secondary p-2">
            <span>
              {profile.ridesAsPassengerCount ?? 0}
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
            {profile.user.email}
          </p>
          <p>
            <span className="text-label">Contato: </span>
            {profile.user.phoneNumber ?? "(não definido)"}
          </p>
          {authUser?.id == userId && (
            <p>
              <span className="text-label">Endereço: </span>
              {profile.user.address ?? "(não definido)"}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
