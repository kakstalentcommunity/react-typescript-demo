import { Activity, Gauge, Target, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import { exportExcel } from "../../utils/exportExcel";
import { useAppData } from "../../context/AppDataContext";
import { parseMoney } from "../../utils/money";

const Analytics = () => {
  const { employees, inventory, transactions } = useAppData();
  const paidRevenue = transactions
    .filter((transaction) => transaction.status === "Paid")
    .reduce((total, transaction) => total + parseMoney(transaction.amount), 0);
  const openInvoiceTotal = transactions
    .filter((transaction) => transaction.status !== "Paid")
    .reduce((total, transaction) => total + parseMoney(transaction.amount), 0);
  const lowStockCount = inventory.filter(
    (item) => item.status !== "Healthy" || item.stock <= 20
  ).length;
  const stockUnits = inventory.reduce((total, item) => total + item.stock, 0);
  const collectionRate = transactions.length
    ? Math.round(
        (transactions.filter((transaction) => transaction.status === "Paid").length /
          transactions.length) *
          100
      )
    : 0;
  const efficiencyScore = Math.min(
    100,
    employees.length * 10 + inventory.length * 8 + transactions.length * 6
  );
  const analyticsScores = [
    { name: "Employees", score: employees.length },
    { name: "Stock", score: stockUnits },
    { name: "Paid", score: paidRevenue },
    { name: "Open", score: openInvoiceTotal },
    { name: "Low stock", score: lowStockCount },
  ].filter((item) => item.score > 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Intelligence
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Business Analytics
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <TrendingUp className="text-emerald-300" size={21} />
            <p className="mt-3 text-2xl font-bold">{collectionRate}%</p>
            <p className="text-sm text-slate-400">Collection rate</p>
          </Card>
          <Card>
            <Gauge className="text-sky-300" size={21} />
            <p className="mt-3 text-2xl font-bold">{efficiencyScore}</p>
            <p className="text-sm text-slate-400">Efficiency score</p>
          </Card>
          <Card>
            <Target className="text-amber-300" size={21} />
            <p className="mt-3 text-2xl font-bold">{transactions.length}</p>
            <p className="text-sm text-slate-400">Invoice records</p>
          </Card>
          <Card>
            <Activity className="text-rose-300" size={21} />
            <p className="mt-3 text-2xl font-bold">{lowStockCount}</p>
            <p className="text-sm text-slate-400">Risk signals</p>
          </Card>
        </div>

        <Card className="min-h-[420px]">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-lg font-semibold">Department performance</h2>
              <p className="text-sm text-slate-500">Composite score by business unit</p>
            </div>
            <button
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 sm:w-auto"
              onClick={() =>
                exportExcel("analytics-export", [
                  { name: "Analytics", rows: analyticsScores },
                ])
              }
              type="button"
            >
              Export Excel
            </button>
          </div>
          {analyticsScores.length ? (
            <div className="h-[320px]">
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={analyticsScores} margin={{ left: -20, right: 10, top: 10 }}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                  <XAxis axisLine={false} dataKey="name" tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="score" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950/50 px-4 text-center text-sm text-slate-500">
              Analytics data will appear after real records are available.
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
