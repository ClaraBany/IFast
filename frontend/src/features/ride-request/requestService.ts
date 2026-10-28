import type { IdResponse } from "@shared/types/common";
import { Neighborhoods } from "@shared/types/neighborhoods";
import type { CreateRideRequest, RideRequest, requestSchema } from "./requestTypes";
import type z from "zod";
import { useAuthStore } from "@auth/authStore";
import type { Filter } from "@shared/types/filter";

const STORAGE_KEY = "ifast.mock.ride-requests";

function toCreateRideRequest(form: z.infer<typeof requestSchema>): CreateRideRequest {
  return {
    origin: form.origin,
    destination: form.destination,
    startDateTime: `${form.date}T${form.startTime}`,
    endDateTime: `${form.date}T${form.endTime}`,
  };
}

function getMockRequests(): RideRequest[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored) as RideRequest[];

  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = tomorrow.toLocaleDateString("sv-SE");
  const initial: RideRequest[] = [
    {
      id: 1,
      passenger: { id: 2, name: "Pedro Inácio", pictureUrl: "" },
      origin: Neighborhoods.CIDADE_NOVA,
      destination: Neighborhoods.IFNMG,
      startDateTime: `${date}T06:00:00`,
      endDateTime: `${date}T07:30:00`,
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveMockRequests(requests: RideRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export async function getAll(filters: Filter): Promise<RideRequest[]> {
  return getMockRequests().filter((request) => {
    const requestDate = request.startDateTime.slice(0, 10);
    const hour = Number(request.startDateTime.slice(11, 13));
    const periodMatches =
      !filters.period ||
      (filters.period === "MORNING" && hour >= 5 && hour < 12) ||
      (filters.period === "AFTERNOON" && hour >= 12 && hour < 18) ||
      (filters.period === "EVENING" && (hour >= 18 || hour < 5));

    return (
      (!filters.date || requestDate === filters.date) &&
      (!filters.origin || request.origin === filters.origin) &&
      (!filters.destination || request.destination === filters.destination) &&
      periodMatches
    );
  });
}

export async function get(requestId: number): Promise<RideRequest> {
  const request = getMockRequests().find((item) => item.id === requestId);
  if (!request) throw new Error("Pedido não encontrado.");
  return request;
}

export async function create(form: z.infer<typeof requestSchema>): Promise<IdResponse> {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error("É necessário estar autenticado para criar um pedido.");

  const requests = getMockRequests();
  const id = Math.max(0, ...requests.map((request) => request.id)) + 1;
  requests.push({
    id,
    passenger: { id: user.id, name: user.name, pictureUrl: user.pictureUrl },
    ...toCreateRideRequest(form),
  });
  saveMockRequests(requests);
  return { id };
}

export async function update(requestId: number, form: z.infer<typeof requestSchema>): Promise<IdResponse> {
  const requests = getMockRequests();
  const index = requests.findIndex((request) => request.id === requestId);
  if (index === -1) throw new Error("Pedido não encontrado.");
  requests[index] = { ...requests[index], ...toCreateRideRequest(form) };
  saveMockRequests(requests);
  return { id: requestId };
}

export async function remove(requestId: number): Promise<void> {
  const requests = getMockRequests();
  if (!requests.some((request) => request.id === requestId)) throw new Error("Pedido não encontrado.");
  saveMockRequests(requests.filter((request) => request.id !== requestId));
}