import type { ReactNode } from "react";
import BackButton from "./BackButton";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="flex-center w-full justify-between">
      <div className="flex-center gap-2.5">
        <BackButton />
        <h2>{title}</h2>
      </div>

      {children && <div className="flex-center gap-3">{children}</div>}
    </header>
  );
}
