import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppData } from "../../context/AppDataContext";
import { parseMoney } from "../../utils/money";
import Card from "../ui/Card";

const monthLabel = (date: string) => {
  if (!date || date === "Today") {
    return new Intl.DateTimeFormat("en", { month: "short" }).format(new Date());
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en", { month: "short" }).format(parsed);
};

const ChartCard = () => {
  const { transactions } = useAppData();
  const paidTransactions = transactions.filter(
    (transaction) => transaction.status === "Paid"
  );
  const revenueData = Object.values(
    paidTransactions.reduce<Record<string, { month: string; revenue: number }>>(
      (months, transaction) => {
        const month = monthLabel(transaction.date);
        months[month] ??= { month, revenue: 0 };
        months[month].revenue += parseMoney(transaction.amount);
        return months;
      },
      {}
    )
  );

  return (
    <Card className="min-h-[340px]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Revenue trend</h3>
          <p className="text-sm text-slate-500">Paid invoices by month</p>
        </div>
        <span className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1 text-sm font-semibold text-slate-400">
          {revenueData.length ? `${revenueData.length} month(s)` : "No data"}
        </span>
      </div>

      {revenueData.length ? (
        <div className="h-[250px]">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={revenueData} margin={{ left: -20, right: 10, top: 10 }}>
              <defs>
                <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis axisLine={false} dataKey="month" tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  color: "#fff",
                }}
              />
              <Area
                dataKey="revenue"
                fill="url(#revenue)"
                stroke="#38bdf8"
                strokeWidth={3}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950/50 px-4 text-center text-sm text-slate-500">
          Mark an invoice as Paid to populate this graph.
        </div>
      )}
    </Card>
  );
};

export default ChartCard;
