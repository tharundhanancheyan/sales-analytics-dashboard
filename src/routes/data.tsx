import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/dashboard/Layout";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { SalesTable } from "@/components/dashboard/SalesTable";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Data — Sales Analytics Dashboard" },
      { name: "description", content: "Browse, search and sort the cleaned sales dataset." },
      { property: "og:title", content: "Data — Sales Analytics Dashboard" },
      { property: "og:description", content: "Browse, search and sort the cleaned sales dataset." },
    ],
  }),
  component: DataPage,
});

function DataPage() {
  return (
    <Shell>
      <PageHeader title="Cleaned Dataset" subtitle="Every record processed through PySpark and Databricks" />
      <FilterBar />
      <SalesTable pageSize={15} />
    </Shell>
  );
}
