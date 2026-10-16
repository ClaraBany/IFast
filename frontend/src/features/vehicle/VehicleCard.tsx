import type { Vehicle } from "./vehicleTypes";
import { Trash2, Car, LoaderCircle } from "lucide-react";
import { del } from "./vehicleService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { DeleteModal } from "@shared/components/DeleteModal";
import { useState } from "react";
import { Ripples } from "react-ripples-continued";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deleteVehicle, isPending } = useMutation({
    mutationFn: (id: number) => del(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  return (
    <div className="card-container border-neutral-dark">
      <div className="card-badge bg-neutral-dark">
        <Car className="h-6 w-6" />
      </div>

      <Link
        to={`/vehicles/${vehicle.id}/edit`}
        className="flex flex-1 flex-col items-start gap-2.5 after:absolute after:inset-0 after:content-['']"
      >
        <p>
          <strong>Modelo:</strong> {vehicle.model}
        </p>
        <p>
          <strong>Cor:</strong> {vehicle.color}
        </p>
        {vehicle.plate && (
          <p>
            <strong>Placa:</strong> {vehicle.plate}
          </p>
        )}
        {vehicle.capacity && (
          <p>
            <strong>Capacidade:</strong> {vehicle.capacity}
          </p>
        )}
      </Link>

      <button
        className="icon-btn h-fit self-center text-danger"
        onClick={() => setDeleteOpen(true)}
        disabled={isPending}
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
        <Ripples color="var(--ripple-dark)" />
      </button>

      <DeleteModal
        open={deleteOpen}
        title="Excluir Veículo"
        message={`Tem certeza que deseja excluir esse veículo?`}
        isLoading={isPending}
        onConfirm={() => deleteVehicle(vehicle.id)}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
