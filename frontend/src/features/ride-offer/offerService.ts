import { api } from "@shared/api";
import type z from "zod";
import type { Offer } from "./offerTypes";

export async function getAll(): Promise<Offer[]> {
  const response = await api.get<Offer[]>("/offers");
  return response.data;
}

export async function get(offerId: number): Promise<Offer> {
  const response = await api.get<Offer>(`/offers/${offerId}`);
  return response.data;
}

export async function create(offer: z.infer<typeof offerSchema>): Promise<Offer> {
  const payload = {
    ...offer,
    plate: offer.plate?.trim() === "" ? undefined : offer.plate,
  };
  const response = await api.post<Offer>("/offers", payload);
  return response.data;
}

export async function update(offerId: number, offer: z.infer<typeof offerSchema>): Promise<Offer> {
  const payload = {
    ...offer,
    plate: offer.plate?.trim() === "" ? undefined : offer.plate,
  };
  const response = await api.put<Offer>(`/offers/${offerId}`, payload);
  return response.data;
}

export async function del(offerId: number): Promise<void> {
  await api.delete<Offer>(`/offers/${offerId}`);
}
