import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Database, FileSpreadsheet, LineChart, Sparkles, Zap } from "lucide-react";
import { Shell, PageHeader, Panel } from "@/components/dashboard/Layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — Sales Analytics Dashboard" },
      { name: "description", content: "How raw sales data was cleaned with PySpark and Databricks and turned into an interactive dashboard." },
      { property: "og:title", content: "About the Project — Sales Analytics Dashboard" },
      { property: "og:description", content: "How raw sales data was cleaned with PySpark and Databricks and turned into an interactive dashboard." },
    ],
  }),
  component: About,
});

const steps = [
  { icon: FileSpreadsheet, t: "Raw Sales Data", d: "Original order records with gaps, duplicates and inconsistent values." },
  { icon: CheckCircle2, t: "Data Quality Checks", d: "Profiling for nulls, invalid dates, duplicate OrderIDs and outliers." },
  { icon: Zap, t: "PySpark Cleaning", d: "Standardising types, filling missing values with UNKNOWN, deduplicating." },
  { icon: Database, t: "Databricks", d: "Running the pipeline at scale in a collaborative notebook environment." },
  { icon: Sparkles, t: "Cleaned Dataset", d: "A tidy CSV: OrderID, Date, SalesPerson, Amount, Product, Region." },
  { icon: LineChart, t: "Interactive Visualization", d: "This dashboard — filters, KPIs, charts and automatic insights." },
];

function About() {
  return (
    <Shell>
      <PageHeader title="About the Project" subtitle="IBM Data Visualization — from raw records to interactive insight" />
      <Panel title="Project Workflow">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {steps.map((s, i) => (
            <div key={s.t} className="relative animate-rise border border-border bg-muted/50 p-4" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground"><s.icon className="h-4 w-4" /></span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="text-sm font-semibold">{s.t}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
              {i < steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 text-primary lg:block" />}
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="How to use the dashboard" className="mt-4">
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Use the filters to narrow by date, region, product or salesperson — everything updates instantly.</li>
          <li>Hover over any chart to see exact values and percentages.</li>
          <li>Search, sort and page through records in the Data view.</li>
          <li>"Unknown" marks values that were missing in the original data and filled during cleaning.</li>
        </ul>
      </Panel>
    </Shell>
  );
}
