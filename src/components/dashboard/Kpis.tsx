import { DollarSign, Globe, Package, Receipt, ShoppingCart } from "lucide-react";
import { useFilters } from "@/lib/filters-context";
import { fmtMoney, kpis } from "@/lib/sales";

export function Kpis() {
  const { data } = useFilters();
  const k = kpis(data);
  const items = [
    { label: "Total Sales", value: fmtMoney(k.total), icon: DollarSign },
    { label: "Total Orders", value: k.orders, icon: ShoppingCart },
    { label: "Avg Order Value", value: fmtMoney(k.aov), icon: Receipt },
    { label: "Products", value: k.products, icon: Package },
    { label: "Sales Regions", value: k.regions, icon: Globe },
  ];
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {items.map((i, n) => (
        <div key={i.label} className="animate-rise border border-border border-t-4 border-t-primary bg-card p-4" style={{ animationDelay: `${n * 60}ms` }}>
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {i.label} <i.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold">{i.value}</div>
        </div>
      ))}
    </div>
  );
}
