import { useSearchParams } from "react-router";
import z from "zod";
import { Neighborhoods } from "@user/userTypes";
import { Period } from "@ride-offer/offerTypes";

export const FILTER_KEYS = ["period", "date", "origin", "destination"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];

type FilterInput = { [K in FilterKey]?: string | null };

const periodSchema = z.enum(Period);
const dateSchema = z.iso.date();
const neighborhoodSchema = z.enum(Neighborhoods);

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    period: periodSchema.safeParse(searchParams.get("period")).data,
    date: dateSchema.safeParse(searchParams.get("date")).data,
    origin: neighborhoodSchema.safeParse(searchParams.get("origin")).data,
    destination: neighborhoodSchema.safeParse(searchParams.get("destination")).data,
  };

  const hasFilters = Object.values(filters).some((value) => value !== undefined);

  const applyFilters = (input: FilterInput) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const key of FILTER_KEYS) {
        const value = input[key];
        if (value) next.set(key, value);
        else next.delete(key);
      }
      return next;
    });

  const removeFilter = (key: FilterKey) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      return next;
    });

  const clearFilters = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const key of FILTER_KEYS) next.delete(key);
      return next;
    });

  return { filters, hasFilters, applyFilters, removeFilter, clearFilters };
}
