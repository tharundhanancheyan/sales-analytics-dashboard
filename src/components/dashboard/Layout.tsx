import { Link } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import type { ReactNode } from "react";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/analysis", label: "Sales Analysis" },
  { to: "/data", label: "Data" },
  { to: "/about", label: "About Project" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center bg-primary"><BarChart3 className="h-4 w-4" /></span>
            Sales Analytics
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="border-b-2 border-transparent px-3 py-2 opacity-75 transition hover:opacity-100"
                activeProps={{ className: "!border-primary !opacity-100" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6">{children}</main>
      <footer className="border-t border-border bg-card py-5 text-center text-xs text-muted-foreground">
        Sales Analytics Dashboard | Data processed using PySpark &amp; Databricks | Data Visualization Project
      </footer>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 animate-rise">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-1 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function Panel({ title, desc, children, action, className = "" }: { title: string; desc?: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <section className={`animate-rise border border-border bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
