import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/lib/filters-context";
import { fmtDate, fmtMoney, type Sale } from "@/lib/sales";
import { Panel } from "./Layout";

const cols: { key: keyof Sale; label: string }[] = [
  { key: "orderId", label: "Order ID" },
  { key: "date", label: "Date" },
  { key: "salesPerson", label: "Salesperson" },
  { key: "amount", label: "Amount" },
  { key: "product", label: "Product" },
  { key: "region", label: "Region" },
];

export function SalesTable({ pageSize = 10 }: { pageSize?: number }) {
  const { data } = useFilters();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: keyof Sale; asc: boolean }>({ key: "date", asc: true });
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const s = q.toLowerCase();
    const f = data.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(s)));
    return f.sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      const c = typeof x === "number" ? x - (y as number) : String(x).localeCompare(String(y), undefined, { numeric: true });
      return sort.asc ? c : -c;
    });
  }, [data, q, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const p = Math.min(page, pages - 1);
  const view = rows.slice(p * pageSize, p * pageSize + pageSize);

  return (
    <Panel
      title="Sales Records"
      desc={`${rows.length} matching orders`}
      action={
        <div className="relative w-48 md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search…" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} className="pl-8" />
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              {cols.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-3 py-2">
                  <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort({ key: c.key, asc: sort.key === c.key ? !sort.asc : true })}>
                    {c.label}
                    {sort.key === c.key && (sort.asc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={r.orderId + i} className="border-b border-border/60 transition hover:bg-accent/50">
                <td className="px-3 py-2 font-mono">{r.orderId}</td>
                <td className="whitespace-nowrap px-3 py-2">{fmtDate(r.date)}</td>
                <td className="px-3 py-2">{r.salesPerson}</td>
                <td className="px-3 py-2 font-mono">{fmtMoney(r.amount)}</td>
                <td className="px-3 py-2">{r.product}</td>
                <td className="px-3 py-2">{r.region}</td>
              </tr>
            ))}
            {!view.length && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No matching records</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <span className="text-muted-foreground">Page {p + 1} of {pages}</span>
        <Button size="icon" variant="outline" disabled={p === 0} onClick={() => setPage(p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
        <Button size="icon" variant="outline" disabled={p >= pages - 1} onClick={() => setPage(p + 1)}><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </Panel>
  );
}
