import { MAX_DAYS_AHEAD } from "@shared/constants";

export function getMinDate(): string {
  return new Date().toLocaleDateString("sv-SE");
}

export function getMaxDate(): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);
  return maxDate.toLocaleDateString("sv-SE");
}
