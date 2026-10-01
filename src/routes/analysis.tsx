import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/dashboard/Layout";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { PersonChart, ProductChart, RegionChart, RegionProductMatrix, TrendChart } from "@/components/dashboard/Charts";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Sales Analysis — Sales Analytics Dashboard" },
      { name: "description", content: "Detailed comparisons of sales across regions, products and salespeople." },
      { property: "og:title", content: "Sales Analysis — Sales Analytics Dashboard" },
      { property: "og:description", content: "Detailed comparisons of sales across regions, products and salespeople." },
    ],
  }),
  component: Analysis,
});

function Analysis() {
  return (
    <Shell>
      <PageHeader title="Sales Analysis" subtitle="Larger views and side-by-side comparisons" />
      <FilterBar />
      <div className="space-y-4">
        <TrendChart h={360} />
        <TrendChart h={300} cumulative />
        <RegionProductMatrix />
        <div className="grid gap-4 lg:grid-cols-2">
          <RegionChart h={340} />
          <ProductChart h={340} />
        </div>
        <PersonChart h={380} />
      </div>
    </Shell>
  );
}
