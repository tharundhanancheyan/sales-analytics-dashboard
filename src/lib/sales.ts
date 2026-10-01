import raw from "@/data/cleaned_dataset.csv?raw";

export type Sale = {
  orderId: string;
  date: string; // YYYY-MM-DD
  salesPerson: string;
  amount: number;
  product: string;
  region: string;
};

const clean = (v: string | undefined) => {
  const t = (v ?? "").trim();
  return !t || t.toUpperCase() === "UNKNOWN" || t.toUpperCase() === "NULL" ? "Unknown" : t;
};

function parseCsv(text: string): Sale[] {
  const lines = text.trim().split(/\r?\n/);
  const header = (lines[0] ?? "").split(",").map((h) => h.trim());
  const idx = (k: string) => header.indexOf(k);
  const out: Sale[] = [];
  for (const line of lines.slice(1)) {
    const c = line.split(",");
    const date = (c[idx("Date")] ?? "").trim();
    const amount = Number(c[idx("Amount")]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) continue;
    out.push({
      orderId: (c[idx("OrderID")] ?? "").trim(),
      date,
      salesPerson: clean(c[idx("SalesPerson")]),
      amount: Number.isFinite(amount) ? amount : 0,
      product: clean(c[idx("Product")]),
      region: clean(c[idx("Region")]),
    });
  }
  return out;
}

export const SALES: Sale[] = parseCsv(raw);

const uniq = (arr: string[]) => Array.from(new Set(arr)).sort();
export const REGIONS = uniq(SALES.map((s) => s.region));
export const PRODUCTS = uniq(SALES.map((s) => s.product));
export const PEOPLE = uniq(SALES.map((s) => s.salesPerson));
const sortedDates = SALES.map((s) => s.date).sort();
export const MIN_DATE = sortedDates[0] ?? "";
export const MAX_DATE = sortedDates[sortedDates.length - 1] ?? "";

export type Filters = { from: string; to: string; region: string; product: string; person: string };
export const DEFAULT_FILTERS: Filters = { from: MIN_DATE, to: MAX_DATE, region: "all", product: "all", person: "all" };

export function applyFilters(data: Sale[], f: Filters) {
  return data.filter(
    (s) =>
      (!f.from || s.date >= f.from) &&
      (!f.to || s.date <= f.to) &&
      (f.region === "all" || s.region === f.region) &&
      (f.product === "all" || s.product === f.product) &&
      (f.person === "all" || s.salesPerson === f.person),
  );
}

export type Group = { name: string; total: number; orders: number };
export function groupBy(data: Sale[], key: "region" | "product" | "salesPerson" | "date"): Group[] {
  const m = new Map<string, { total: number; ids: Set<string> }>();
  for (const s of data) {
    const g = m.get(s[key]) ?? { total: 0, ids: new Set() };
    g.total += s.amount;
    g.ids.add(s.orderId);
    m.set(s[key], g);
  }
  return Array.from(m, ([name, g]) => ({ name, total: g.total, orders: g.ids.size }));
}

export function kpis(data: Sale[]) {
  const total = data.reduce((a, s) => a + s.amount, 0);
  const orders = new Set(data.map((s) => s.orderId)).size;
  return {
    total,
    orders,
    aov: orders ? total / orders : 0,
    products: new Set(data.map((s) => s.product)).size,
    regions: new Set(data.map((s) => s.region)).size,
  };
}

export const top = (g: Group[]): Group => [...g].sort((a, b) => b.total - a.total)[0] ?? { name: "—", total: 0, orders: 0 };

export const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
export const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
