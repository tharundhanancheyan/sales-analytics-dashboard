import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_FILTERS, SALES, applyFilters, type Filters, type Sale } from "./sales";

type Ctx = { filters: Filters; setFilters: (f: Filters) => void; reset: () => void; data: Sale[] };
const FiltersCtx = createContext<Ctx | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const data = useMemo(() => applyFilters(SALES, filters), [filters]);
  return (
    <FiltersCtx.Provider value={{ filters, setFilters, reset: () => setFilters(DEFAULT_FILTERS), data }}>
      {children}
    </FiltersCtx.Provider>
  );
}

export function useFilters() {
  const c = useContext(FiltersCtx);
  if (!c) throw new Error("useFilters must be used within FiltersProvider");
  return c;
}
