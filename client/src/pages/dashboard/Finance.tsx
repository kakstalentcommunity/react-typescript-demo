import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Banknote, CreditCard, FileCheck2, Trash2, WalletCards } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import type { Transaction } from "../../data/systemData";
import { exportExcel } from "../../utils/exportExcel";
import Input from "../../components/ui/Input";
import { useAppData } from "../../context/AppDataContext";
import { formatMoney, parseMoney } from "../../utils/money";

const initialInvoiceForm = {
  vendor: "",
  amount: "",
  status: "Pending",
  date: "",
};

const Finance = () => {
  const {
    addTransaction,
    deleteTransaction,
    transactions: invoiceRows,
  } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialInvoiceForm);

  const openInvoiceTotal = useMemo(
    () =>
      invoiceRows
        .filter((transaction) => transaction.status !== "Paid")
        .reduce((total, transaction) => total + parseMoney(transaction.amount), 0),
    [invoiceRows]
  );

  const paidTotal = useMemo(
    () =>
      invoiceRows
        .filter((transaction) => transaction.status === "Paid")
        .reduce((total, transaction) => total + parseMoney(transaction.amount), 0),
    [invoiceRows]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextId = `INV-${1001 + invoiceRows.length}`;
    const rawAmount = Number(form.amount);
    const newInvoice: Transaction = {
      id: nextId,
      vendor: form.vendor.trim(),
      amount: formatMoney(rawAmount),
      status: form.status,
      date: form.date || "Today",
    };

    addTransaction(newInvoice);
    setForm(initialInvoiceForm);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Finance
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Payments & Invoices
            </h1>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)} type="button">
            <FileCheck2 size={18} />
            New invoice
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <Banknote className="text-emerald-300" size={21} />
            <p className="mt-3 text-2xl font-bold">{formatMoney(paidTotal)}</p>
            <p className="text-sm text-slate-400">Monthly revenue</p>
          </Card>
          <Card>
            <WalletCards className="text-sky-300" size={21} />
            <p className="mt-3 text-2xl font-bold">{formatMoney(openInvoiceTotal)}</p>
            <p className="text-sm text-slate-400">Open invoices</p>
          </Card>
          <Card>
            <CreditCard className="text-amber-300" size={21} />
            <p className="mt-3 text-2xl font-bold">KSH 0</p>
            <p className="text-sm text-slate-400">Expenses</p>
          </Card>
          <Card>
            <FileCheck2 className="text-emerald-300" size={21} />
            <p className="mt-3 text-2xl font-bold">0%</p>
            <p className="text-sm text-slate-400">Collection rate</p>
          </Card>
        </div>

        <Card>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">Recent transactions</h2>
            <Button
              className="w-full sm:w-auto"
              onClick={() =>
                exportExcel("finance-export", [
                  { name: "Transactions", rows: invoiceRows },
                ])
              }
              size="sm"
              type="button"
              variant="secondary"
            >
              Export Excel
            </Button>
          </div>

          <div className="divide-y divide-slate-800">
            {invoiceRows.map((transaction) => (
              <div className="grid gap-3 py-4 text-sm md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto]" key={transaction.id}>
                <span className="font-mono text-slate-400">{transaction.id}</span>
                <span className="font-semibold">{transaction.vendor}</span>
                <span>{transaction.amount}</span>
                <span className="text-slate-400">{transaction.date}</span>
                <span className="w-fit rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300">
                  {transaction.status}
                </span>
                <button
                  aria-label={`Delete ${transaction.id}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300"
                  onClick={() => deleteTransaction(transaction.id)}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {!invoiceRows.length ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No invoices have been created yet.
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-lg border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-slate-950 sm:rounded-lg sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">New invoice</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Create an invoice entry for finance tracking.
                </p>
              </div>
              <button
                className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-slate-900 hover:text-white"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Vendor"
                onChange={(event) =>
                  setForm((current) => ({ ...current, vendor: event.target.value }))
                }
                placeholder="Acme Supplies"
                required
                value={form.vendor}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Amount"
                  min={1}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, amount: event.target.value }))
                  }
                  placeholder="4200"
                  required
                  type="number"
                  value={form.amount}
                />
                <Input
                  label="Date"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, date: event.target.value }))
                  }
                  type="date"
                  value={form.date}
                />
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-300">Status</span>
                <select
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  value={form.status}
                >
                  <option>Pending</option>
                  <option>Review</option>
                  <option>Paid</option>
                </select>
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <FileCheck2 size={18} />
                  Save invoice
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default Finance;
