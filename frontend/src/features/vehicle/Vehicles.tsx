import VehicleCard from "./VehicleCard";
import { getAll } from "./VehicleService";
import { LoaderCircle, Plus } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@shared/components/PageHeader";
import RetryError from "@shared/components/RetryError";

export default function Vehicles() {
  const {
    data: vehicles = [],
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getAll,
  });

  if (isLoading) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (isError) {
    return <RetryError onRetry={refetch} isFetching={isFetching} />;
  }

  return (
    <>
      <title>Veículos</title>
      <PageHeader title="Meus veículos" />

      <div className="mb-16 grid grid-cols-1 gap-7.5 md:grid-cols-2">
        {vehicles.length === 0 ? (
          <p className="text-neutral-dark">Você ainda não tem nenhum veículo cadastrado.</p>
        ) : (
          vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
        )}
      </div>

      <Link to={"/vehicles/create"} className="btn btn-lg fixed right-5 bottom-25 w-fit bg-primary">
        <Plus size={24} />
        Cadastrar Veículo
      </Link>
    </>
  );
}
