import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import ChartCard from "../../components/dashboard/ChartCard";
import { BriefcaseBusiness, DollarSign, PackageCheck, ShoppingCart } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { formatMoney, parseMoney } from "../../utils/money";

const Dashboard = () => {
  const { employees, inventory, transactions } = useAppData();
  const revenue = transactions
    .filter((transaction) => transaction.status === "Paid")
    .reduce((total, transaction) => total + parseMoney(transaction.amount), 0);
  const stockTotal = inventory.reduce((total, item) => total + item.stock, 0);
  const openInvoices = transactions.filter(
    (transaction) => transaction.status !== "Paid"
  ).length;
  const priorityWork = [
    openInvoices ? `${openInvoices} invoice(s) need attention` : null,
    inventory.some((item) => item.status !== "Healthy" || item.stock <= 20)
      ? "Review low-stock inventory"
      : null,
    employees.length ? null : "Add employees to begin staffing reports",
  ].filter(Boolean);

  const stats = [
    {
      title: "Total Employees",
      value: String(employees.length),
      change: employees.length ? "Directory active" : "No employees yet",
      icon: BriefcaseBusiness,
    },
    {
      title: "Revenue",
      value: formatMoney(revenue),
      change: revenue ? "From paid invoices" : "No paid invoices yet",
      icon: DollarSign,
    },
    {
      title: "Inventory",
      value: stockTotal.toLocaleString(),
      change: stockTotal ? "Units in stock" : "No stock yet",
      icon: PackageCheck,
    },
    {
      title: "Orders",
      value: String(transactions.length),
      change: transactions.length ? "Invoice records" : "No orders yet",
      icon: ShoppingCart,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Overview
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Enterprise Resource Planning Dashboard
            </h1>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400 sm:px-4 sm:py-3">
            Live data sync: <span className="font-semibold text-emerald-300">online</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <ChartCard />
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-5">
            <h3 className="text-lg font-semibold">Priority work</h3>
            {priorityWork.length ? (
              <div className="mt-5 space-y-3">
                {priorityWork.map((item) => (
                  <div
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                    key={item}
                  >
                    <span className="text-sm text-slate-300">{item}</span>
                    <span className="h-2 w-2 rounded-full bg-sky-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950/50 px-4 text-center text-sm text-slate-500">
                Priority work will appear after you add employees, stock, or invoices.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
