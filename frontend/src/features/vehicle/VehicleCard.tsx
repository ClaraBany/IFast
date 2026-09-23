import type { Vehicle } from "@/shared/types";
import { Pencil, Trash2, Car, LoaderCircle } from "lucide-react";
import { del } from "./VehicleService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useState } from "react";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deleteVehicle, isPending } = useMutation({
    mutationFn: (id: number) => del(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  return (
    <div className="box-shadow relative flex max-w-150 justify-between overflow-hidden rounded-2xl border border-neutral-dark bg-white px-7.5 py-2.5">
      <div className="absolute top-0 right-0 flex-center h-9 w-9 rounded-bl-2xl bg-neutral-dark text-white">
        <Car className="h-6 w-6" />
      </div>

      <div className="flex flex-1 flex-col items-start gap-2.5">
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
      </div>
      <div className="flex-center gap-3.5">
        <Link to={`/vehicles/${vehicle.id}/edit`} className="icon-btn text-secondary">
          <Pencil />
        </Link>

        <button className="icon-btn text-danger" onClick={() => setConfirmOpen(true)} disabled={isPending}>
          {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
        </button>
      </div>
      <ConfirmModal
        open={confirmOpen}
        title="Excluir veículo"
        message={`Tem certeza que deseja excluir esse veículo?`}
        isLoading={isPending}
        onConfirm={() => deleteVehicle(vehicle.id)}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
