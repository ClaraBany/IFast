import type { Vehicle } from "@/shared/types";
import { Pencil, Trash2, Car, LoaderCircle } from "lucide-react";
import { del } from "./VehicleService";
import { ApiError } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    const queryClient = useQueryClient();

    const { mutate: deleteVehicle, isPending } = useMutation({
        mutationFn: (id: number) => del(id),
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
        onError: (error) => {
        if (error instanceof ApiError) {
            // tratar erro (toast, etc)
        }
        },
    });
    return (   
    <div className="box-shadow relative flex max-w-150 justify-between overflow-hidden rounded-2xl border border-neutral-dark bg-white px-7.5 py-2.5">
      <div className="absolute top-0 right-0 flex-center h-9 w-9 rounded-bl-2xl bg-neutral-dark text-white">
        <Car className="h-6 w-6" />
      </div>

      <div className="flex flex-col items-start gap-2.5 flex-1">
        <p>
          <strong>Modelo:</strong> {vehicle.model}
        </p>
        <p>
          <strong>Cor:</strong> {vehicle.color}
        </p>
        <p>
          <strong>Placa:</strong> {vehicle.plate}
        </p>
      </div>
      <div className="flex gap-3.5">
        <Link to={`/vehicles/${vehicle.id}/edit`} className="icon-btn text-secondary">
      
          <Pencil />
        
        </Link>
        
        <button className="icon-btn text-danger" onClick={() => deleteVehicle(vehicle.id)} disabled={isPending}>
        {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
        </button>
      </div>
      {/* max w */}
    </div>
  );
}
