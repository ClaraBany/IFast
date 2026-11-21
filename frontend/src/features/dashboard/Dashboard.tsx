import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarDays, CircleCheckBig, CircleX, LoaderCircle, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import RetryError from "@shared/components/RetryError";
import { NeighborhoodsLabels, type Neighborhoods } from "@shared/types/neighborhoods";
import { getDashboard } from "./dashboardService";
import {
  DashboardPreset,
  dashboardCustomFilterSchema,
  dashboardPresetLabels,
  dashboardWeekdayLabels,
  type DashboardCustomFilter,
  type DashboardFilter,
  type DashboardPreset as DashboardPresetValue,
} from "./dashboardTypes";
import DashboardKPI from "./DashboardKPI";
import { Period, periodLabels } from "@shared/types/filter";
import { PageHeader } from "@shared/components/navigation/PageHeader";
import { Ripples } from "react-ripples-continued";
import RequestIcon from "@assets/card-icons/request.png";
import OfferIcon from "@assets/card-icons/offer.png";

function toLocalDate(date: Date) {
  return date.toLocaleDateString("sv-SE");
}

function getPresetFilter(
  preset: Exclude<DashboardPresetValue, typeof DashboardPreset.CUSTOM | typeof DashboardPreset.ALL>,
): DashboardFilter {
  const end = new Date();
  const start = new Date(end);

  if (preset === DashboardPreset.LAST_7_DAYS) start.setDate(start.getDate() - 6);
  if (preset === DashboardPreset.LAST_MONTH) start.setMonth(start.getMonth() - 1);
  if (preset === DashboardPreset.LAST_6_MONTHS) start.setMonth(start.getMonth() - 6);
  if (preset === DashboardPreset.LAST_YEAR) start.setFullYear(start.getFullYear() - 1);

  return {
    startDate: toLocalDate(start),
    endDate: toLocalDate(end),
  };
}

export default function Dashboard() {
  const [preset, setPreset] = useState<DashboardPresetValue>(DashboardPreset.ALL);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DashboardCustomFilter>({
    resolver: zodResolver(dashboardCustomFilterSchema),
    defaultValues: { startDate: "", endDate: "" },
  });
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const [filter, setFilter] = useState<DashboardFilter>({});

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["dashboard", filter],
    queryFn: () => getDashboard(filter),
  });

  function selectPreset(nextPreset: Exclude<DashboardPresetValue, typeof DashboardPreset.CUSTOM>) {
    setPreset(nextPreset);
    setFilter(nextPreset === DashboardPreset.ALL ? {} : getPresetFilter(nextPreset));
  }

  function applyCustomPeriod({ startDate, endDate }: DashboardCustomFilter) {
    setPreset(DashboardPreset.CUSTOM);
    setFilter({
      startDate,
      endDate,
    });
  }

  if (isError) {
    return <RetryError onRetry={refetch} isFetching={isFetching} />;
  }

  const periodData = (data?.ridesByPeriod ?? []).map((point) => ({
    label: periodLabels[point.label as Period] ?? point.label,
    count: point.count,
  }));
  const neighborhoodData = (data?.ridesByNeighboors ?? [])
    .map((point) => ({
      label: NeighborhoodsLabels[point.label as Neighborhoods] ?? point.label,
      count: point.count,
    }))
    .sort((a, b) => b.count - a.count);

  const weekdayData = Object.entries(dashboardWeekdayLabels).map(([weekday, label]) => {
    const point = data?.ridesByWeekdays.find((item) => item.label === weekday);

    return {
      label,
      count: point?.count ?? 0,
    };
  });

  return (
    <>
      <title>Dashboard</title>
      <PageHeader title="Dashboard" />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DashboardKPI
          icon={<img src={RequestIcon} alt="" className="size-6 object-contain" />}
          color="pending"
          title="Pedidos Pendentes"
          data={data?.openRequests}
          sub="No momento"
          /> 
          <DashboardKPI
          icon={<img src={OfferIcon} alt="" className="size-6 object-contain" />}
          color="primary"
          title="Caronas Disponíveis"
          data={data?.openRides}
          sub="No momento"
        />
        </section>

     <section className="grid grid-cols-1 items-start gap-4 rounded-2xl bg-white p-4 box-shadow md:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-2">
          <CalendarDays size={20} className="text-slate-700" />
          <h3 className="text-slate-900">Selecione o tempo</h3>
        </div>

        <div className="flex-column gap-4 w-full md:ml-auto md:w-fit">
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {Object.values(DashboardPreset).map((value) => (
              <label
                key={value}
                className="btn btn-sm w-25 cursor-pointer bg-neutral-light transition-all has-checked:bg-primary-selected has-checked:box-shadow"
              >
                <input
                  type="radio"
                  name="dashboard-preset"
                  value={value}
                  checked={preset === value}
                  className="sr-only"
                  onChange={() => (value === DashboardPreset.CUSTOM ? setPreset(value) : selectPreset(value))}
                />
                <span className="text-slate-900">{dashboardPresetLabels[value]}</span>
              </label>
            ))}
          </div>

          {preset === DashboardPreset.CUSTOM && (
            <form
              className=" w-full rounded-xl bg-neutral-light/60 p-3"
              onSubmit={handleSubmit(applyCustomPeriod)}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="field ">
                  <input
                    {...register("startDate")}
                    id="dashboard-start-date"
                    type="date"
                    max={endDate || undefined}
                    className="bg-white"
                    aria-invalid={errors.startDate ? "true" : "false"}
                  />
                  {errors.startDate && <span>{errors.startDate.message}</span>}
                </div>
                <div className="field">
                  <input
                    {...register("endDate")}
                    id="dashboard-end-date"
                    type="date"
                    min={startDate || undefined}
                    className="bg-white"
                    aria-invalid={errors.endDate ? "true" : "false"}
                  />
                  {errors.endDate && <span>{errors.endDate.message}</span>}
                </div>
              </div>
              <button type="submit" className="btn btn-sm mt-3 bg-primary">
                Aplicar
                <Ripples color="var(--ripple-light)" />
              </button>
            </form>
          )}
        </div>
      </section>

      {isLoading ? (
        <div className="flex-center min-h-64">
          <LoaderCircle className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            
            <DashboardKPI
          icon={<Users className="size-5" />}
          color="tertiary"
          title="Usuários cadastrado"
          data={data?.registeredUsers}
          sub="No período selecionado"
        />

        <DashboardKPI
          icon={<CircleCheckBig className="size-5" />}
          color="secondary"
          title="Caronas concluídas"
          data={data?.completedRides}
          sub="No período selecionado"
        />

         <DashboardKPI
          icon={<CircleX className="size-5" />}
          color="danger"
          title="Caronas canceladas"
          data={data?.cancelledRides}
          sub="No período selecionado"
        />
        </section>

          <section className="flex-column gap-5">
            <h3>Relatórios</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <article className="rounded-2xl bg-white p-4 box-shadow">
                <p className="text-label">Distribuição de Caronas por Turno</p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={periodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} width={20} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="Caronas"
                        fill="var(--color-primary)"
                        activeBar={{ fill: "var(--color-secondary)" }}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-2xl bg-white p-4 box-shadow">
                <p className="text-label">Ranking de Regiões - Origem da carona</p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={neighborhoodData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="label" width={70} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="Caronas"
                        fill="var(--color-secondary)"
                        activeBar={{ fill: "var(--color-primary)" }}
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-2xl bg-white p-4 box-shadow lg:col-span-2">
                <p className="text-label">Fluxo por Dia da Semana</p>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weekdayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} width={20} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Caronas"
                        stroke="var(--color-tertiary)"
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>
          </section>
        </>
      )}
    </>
  );
}