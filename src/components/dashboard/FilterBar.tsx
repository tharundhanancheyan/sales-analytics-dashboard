import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/lib/filters-context";
import { MAX_DATE, MIN_DATE, PEOPLE, PRODUCTS, REGIONS, SALES } from "@/lib/sales";

function Pick({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background text-foreground"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </label>
  );
}

export function FilterBar() {
  const { filters: f, setFilters, reset, data } = useFilters();
  const set = (k: keyof typeof f) => (v: string) => setFilters({ ...f, [k]: v });
  return (
    <div className="mb-6 animate-rise border border-border bg-card p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          From
          <Input type="date" min={MIN_DATE} max={MAX_DATE} value={f.from} onChange={(e) => set("from")(e.target.value)} className="bg-background text-foreground" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          To
          <Input type="date" min={MIN_DATE} max={MAX_DATE} value={f.to} onChange={(e) => set("to")(e.target.value)} className="bg-background text-foreground" />
        </label>
        <Pick label="Region" value={f.region} options={REGIONS} onChange={set("region")} />
        <Pick label="Product" value={f.product} options={PRODUCTS} onChange={set("product")} />
        <Pick label="Salesperson" value={f.person} options={PEOPLE} onChange={set("person")} />
        <div className="flex flex-col justify-end gap-1">
          <Button variant="outline" onClick={reset}><X className="h-4 w-4" /> Clear Filters</Button>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Showing <span className="font-mono font-semibold text-foreground">{data.length}</span> of {SALES.length} records
      </p>
    </div>
  );
}
