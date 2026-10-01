import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Area, AreaChart } from "recharts";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/lib/filters-context";
import { fmtDate, fmtMoney, groupBy } from "@/lib/sales";
import { Panel } from "./Layout";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const tip = { contentStyle: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 } };
const axis = { stroke: "var(--muted-foreground)", fontSize: 12 };
const money = (v: number) => fmtMoney(v);
const Empty = () => <div className="grid h-full place-items-center text-sm text-muted-foreground">No data for current filters</div>;

export function RegionChart({ h = 280 }: { h?: number }) {
  const { data } = useFilters();
  const d = groupBy(data, "region").sort((a, b) => b.total - a.total);
  return (
    <Panel title="Sales by Region" desc="Total sales amount per region">
      <div style={{ height: h }}>
        {d.length ? (
          <ResponsiveContainer>
            <BarChart data={d}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip {...tip} formatter={(v: number) => [money(v), "Sales"]} cursor={{ fill: "var(--accent)" }} />
              <Bar dataKey="total" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <Empty />}
      </div>
    </Panel>
  );
}

export function ProductChart({ h = 280 }: { h?: number }) {
  const { data } = useFilters();
  const d = groupBy(data, "product");
  const sum = d.reduce((a, g) => a + g.total, 0);
  return (
    <Panel title="Sales by Product" desc="Share of total sales per product">
      <div style={{ height: h }}>
        {d.length ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie data={d} dataKey="total" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2}>
                {d.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tip} formatter={(v: number, n) => [`${money(v)} (${((v / sum) * 100).toFixed(1)}%)`, n]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        ) : <Empty />}
      </div>
    </Panel>
  );
}

export function PersonChart({ h = 300 }: { h?: number }) {
  const { data } = useFilters();
  const [desc, setDesc] = useState(true);
  const d = groupBy(data, "salesPerson").sort((a, b) => (desc ? b.total - a.total : a.total - b.total));
  return (
    <Panel
      title="Salesperson Performance"
      desc="Total sales per salesperson"
      action={<Button size="sm" variant="outline" onClick={() => setDesc(!desc)}><ArrowDownUp className="h-3 w-3" />{desc ? "High → Low" : "Low → High"}</Button>}
    >
      <div style={{ height: h }}>
        {d.length ? (
          <ResponsiveContainer>
            <BarChart data={d} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" {...axis} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis type="category" dataKey="name" {...axis} width={90} />
              <Tooltip {...tip} formatter={(v: number) => [money(v), "Sales"]} cursor={{ fill: "var(--accent)" }} />
              <Bar dataKey="total" fill="var(--chart-2)" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <Empty />}
      </div>
    </Panel>
  );
}

export function TrendChart({ h = 280, cumulative = false }: { h?: number; cumulative?: boolean }) {
  const { data } = useFilters();
  let run = 0;
  const d = groupBy(data, "date").sort((a, b) => a.name.localeCompare(b.name)).map((g) => ({ ...g, cum: (run += g.total) }));
  return (
    <Panel title={cumulative ? "Cumulative Sales Over Time" : "Sales Trend"} desc={cumulative ? "Running total of sales by date" : "Daily total sales in chronological order"}>
      <div style={{ height: h }}>
        {d.length ? (
          <ResponsiveContainer>
            {cumulative ? (
              <AreaChart data={d}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" {...axis} tickFormatter={(v) => fmtDate(v).slice(0, 6)} />
                <YAxis {...axis} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip {...tip} labelFormatter={fmtDate} formatter={(v: number) => [money(v), "Cumulative"]} />
                <Area dataKey="cum" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            ) : (
              <LineChart data={d}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" {...axis} tickFormatter={(v) => fmtDate(v).slice(0, 6)} />
                <YAxis {...axis} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip {...tip} labelFormatter={fmtDate} formatter={(v: number) => [money(v), "Sales"]} />
                <Line dataKey="total" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : <Empty />}
      </div>
    </Panel>
  );
}

export function RegionProductMatrix() {
  const { data } = useFilters();
  const regions = Array.from(new Set(data.map((s) => s.region))).sort();
  const products = Array.from(new Set(data.map((s) => s.product))).sort();
  const rows = regions.map((r) => {
    const row: Record<string, number | string> = { name: r };
    for (const p of products) row[p] = data.filter((s) => s.region === r && s.product === p).reduce((a, s) => a + s.amount, 0);
    return row;
  });
  return (
    <Panel title="Region × Product Comparison" desc="How each product contributes to every region's sales">
      <div style={{ height: 340 }}>
        {rows.length ? (
          <ResponsiveContainer>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip {...tip} formatter={(v: number, n) => [money(v), n]} cursor={{ fill: "var(--accent)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {products.map((p, i) => <Bar key={p} dataKey={p} stackId="a" fill={COLORS[i % COLORS.length]} />)}
            </BarChart>
          </ResponsiveContainer>
        ) : <Empty />}
      </div>
    </Panel>
  );
}
