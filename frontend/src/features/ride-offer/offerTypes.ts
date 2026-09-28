import type { User } from "@user/userTypes";
import type { Vehicle } from "@vehicle/vehicleTypes";

export interface Offer {
  id: number;
  status: "Available" | "Completed";

  owner: User;
  passengers: User[];

  vehicle: Vehicle;
  capacity: number;

  origin: string;
  destination: string;

  date: string;
  departureTime: string;

  description: string;
}

export const displayStatusMap = {
  Available: {
    border: "border-primary",
    bg: "bg-primary",
    label: "Disponível",
  },
  Full: {
    border: "border-danger",
    bg: "bg-danger",
    label: "Lotada",
  },
  Completed: {
    border: "border-secondary",
    bg: "bg-secondary",
    label: "Concluída",
  },
};
