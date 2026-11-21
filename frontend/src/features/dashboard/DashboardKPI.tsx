import type { ReactNode } from "react";

type DashboardKPIColor = "primary" | "secondary" | "tertiary" | "pending" | "danger";

type DashboardKPIProps = {
  icon: ReactNode;
  color: DashboardKPIColor;
  title: string;
  data?: number;
  sub: string;
};

const colors: Record<DashboardKPIColor, { icon: string; value: string }> = {
  primary: { icon: "bg-primary", value: "text-primary" },
  secondary: { icon: "bg-secondary", value: "text-secondary" },
  tertiary: { icon: "bg-tertiary", value: "text-tertiary" },
  pending: { icon: "bg-pending", value: "text-pending" },
  danger: { icon: "bg-danger", value: "text-danger" },
};

export default function DashboardKPI({
  icon,
  color,
  title,
  data,
  sub,
}: DashboardKPIProps) {
  return (
    <div className="flex-center gap-10 rounded-2xl bg-white p-4 box-shadow">
      <div className={`flex-center rounded-full ${colors[color].icon} size-12 text-white`}>
        {icon}
      </div>
      <div className="flex-column">
        <p className="text-label">{title}</p>
        <h1 className={colors[color].value}>{data}</h1>
        <p className="text-neutral-dark">{sub}</p>
      </div>
    </div>
  );
}