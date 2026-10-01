import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/dashboard/Layout";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Kpis } from "@/components/dashboard/Kpis";
import { PersonChart, ProductChart, RegionChart, TrendChart } from "@/components/dashboard/Charts";
import { Insights } from "@/components/dashboard/Insights";
import { SalesTable } from "@/components/dashboard/SalesTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sales Analytics Dashboard" },
      { name: "description", content: "Interactive sales performance analysis with KPIs, filters, charts and insights." },
      { property: "og:title", content: "Sales Analytics Dashboard" },
      { property: "og:description", content: "Interactive sales performance analysis with KPIs, filters, charts and insights." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <Shell>
      <PageHeader title="Sales Analytics Dashboard" subtitle="Interactive Sales Performance Analysis" />
      <FilterBar />
      <Kpis />
      <div className="grid gap-4 lg:grid-cols-2">
        <RegionChart />
        <ProductChart />
        <PersonChart />
        <TrendChart />
      </div>
      <div className="mt-4 space-y-4">
        <Insights />
        <SalesTable />
      </div>
    </Shell>
  );
}
