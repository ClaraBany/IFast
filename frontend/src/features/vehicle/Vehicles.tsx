import VehicleCard from "./VehicleCard";
import { getAll } from "./VehicleService";
import { ArrowLeft, LoaderCircle, Plus } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

export default function Vehicles() {
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getAll,
  });

  if (isLoading) {
    return (
      <div className="flex-center min-h-dvh">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-7.5">
      <div className="flex-center gap-2.5 self-start">
        <Link to={"/offer"}>
          <ArrowLeft />
        </Link>

        <h2>Meus veículos</h2>
      </div>
      <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
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
    </div>
  );
}
