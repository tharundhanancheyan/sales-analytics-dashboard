import { Lightbulb } from "lucide-react";
import { useFilters } from "@/lib/filters-context";
import { fmtMoney, groupBy, kpis, top } from "@/lib/sales";
import { Panel } from "./Layout";

export function Insights() {
  const { data } = useFilters();
  if (!data.length) return <Panel title="Key Insights"><p className="text-sm text-muted-foreground">No data for current filters.</p></Panel>;
  const k = kpis(data);
  const r = top(groupBy(data, "region"));
  const p = top(groupBy(data, "product"));
  const s = top(groupBy(data, "salesPerson"));
  const pct = (v: number) => `${((v / k.total) * 100).toFixed(1)}%`;
  const items = [
    { h: "Total sales", v: fmtMoney(k.total), e: "The combined value of every order in the current selection." },
    { h: "Highest-selling region", v: r.name, e: `${r.name} brought in ${fmtMoney(r.total)}, or ${pct(r.total)} of all sales.` },
    { h: "Highest-selling product", v: p.name, e: `${p.name} earned ${fmtMoney(p.total)} across ${p.orders} orders (${pct(p.total)}).` },
    { h: "Top salesperson", v: s.name, e: `${s.name} sold ${fmtMoney(s.total)} from ${s.orders} orders.` },
    { h: "Average order value", v: fmtMoney(k.aov), e: "On average, this is how much a single order is worth." },
    { h: "Number of orders", v: String(k.orders), e: "Count of unique order IDs, so duplicates are never double-counted." },
  ];
  return (
    <Panel title="Key Insights" desc="Calculated automatically from the filtered data">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <div key={i.h} className="flex gap-3 border-l-2 border-primary bg-muted/60 p-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{i.h}</div>
              <div className="font-mono text-lg font-semibold">{i.v}</div>
              <p className="text-xs text-muted-foreground">{i.e}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
