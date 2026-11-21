import z from "zod";

export interface DashboardPoint {
  label: string;
  count: number;
}

export interface Dashboard {
  openRequests: number;
  openRides: number;
  registeredUsers: number;
  completedRides: number;
  cancelledRides: number;
  ridesByNeighboors: DashboardPoint[];
  ridesByPeriod: DashboardPoint[];
  ridesByWeekdays: DashboardPoint[];
}

export interface DashboardFilter {
  startDate?: string;
  endDate?: string;
}

export const dashboardCustomFilterSchema = z
  .object({
    startDate: z.iso.date("Informe a data inicial"),
    endDate: z.iso.date("Informe a data final"),
  })
  .refine((filter) => filter.startDate <= filter.endDate, {
    path: ["endDate"],
    message: "A data final deve ser igual ou posterior à data inicial",
  });

export type DashboardCustomFilter = z.infer<typeof dashboardCustomFilterSchema>;

export const DashboardPreset = {
  ALL: "ALL",
  LAST_7_DAYS: "LAST_7_DAYS",
  LAST_MONTH: "LAST_MONTH",
  LAST_6_MONTHS: "LAST_6_MONTHS",
  LAST_YEAR: "LAST_YEAR",
  CUSTOM: "CUSTOM",
} as const;

export type DashboardPreset = (typeof DashboardPreset)[keyof typeof DashboardPreset];

export const dashboardPresetLabels: Record<DashboardPreset, string> = {
  ALL: "Tudo",
  LAST_7_DAYS: "7 Dias",
  LAST_MONTH: "1 Mês",
  LAST_6_MONTHS: "6 Meses",
  LAST_YEAR: "1 ano",
  CUSTOM: "Período",
};

export const dashboardWeekdayLabels: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};