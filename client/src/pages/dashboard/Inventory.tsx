import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { AlertTriangle, Boxes, PackagePlus, Trash2, Truck } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import type { InventoryItem } from "../../data/systemData";
import { exportExcel } from "../../utils/exportExcel";
import Input from "../../components/ui/Input";
import { useAppData } from "../../context/AppDataContext";

const initialForm = {
  sku: "",
  item: "",
  stock: "",
  location: "Warehouse A",
  status: "Healthy",
};

const Inventory = () => {
  const {
    addInventoryItem,
    deleteInventoryItem,
    inventory: items,
  } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const lowStockCount = useMemo(
    () => items.filter((item) => item.status !== "Healthy" || item.stock <= 20).length,
    [items]
  );

  const totalStock = useMemo(
    () => items.reduce((total, item) => total + item.stock, 0),
    [items]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const stock = Number(form.stock);
    const newItem: InventoryItem = {
      sku: form.sku.trim().toUpperCase(),
      item: form.item.trim(),
      stock,
      location: form.location,
      status: form.status,
    };

    addInventoryItem(newItem);
    setForm(initialForm);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Supply
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Inventory Control
            </h1>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)} type="button">
            <PackagePlus size={18} />
            Add stock
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <Boxes className="text-sky-300" size={22} />
            <p className="mt-3 text-3xl font-bold">{totalStock.toLocaleString()}</p>
            <p className="text-sm text-slate-400">Items tracked</p>
          </Card>
          <Card>
            <AlertTriangle className="text-amber-300" size={22} />
            <p className="mt-3 text-3xl font-bold">{lowStockCount}</p>
            <p className="text-sm text-slate-400">Low-stock alerts</p>
          </Card>
          <Card>
            <Truck className="text-emerald-300" size={22} />
            <p className="mt-3 text-3xl font-bold">0</p>
            <p className="text-sm text-slate-400">Inbound shipments</p>
          </Card>
        </div>

        <Card>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">Stock levels</h2>
            <Button
              className="w-full sm:w-auto"
              onClick={() =>
                exportExcel("inventory-export", [
                  { name: "Inventory", rows: items },
                ])
              }
              size="sm"
              type="button"
              variant="secondary"
            >
              Export Excel
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 font-medium">SKU</th>
                  <th className="py-3 font-medium">Item</th>
                  <th className="py-3 font-medium">Stock</th>
                  <th className="py-3 font-medium">Location</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((row) => (
                  <tr key={row.sku}>
                    <td className="py-4 font-mono text-slate-400">{row.sku}</td>
                    <td className="py-4 font-semibold">{row.item}</td>
                    <td className="py-4">{row.stock}</td>
                    <td className="py-4 text-slate-400">{row.location}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.status === "Healthy"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-amber-400/10 text-amber-300"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        aria-label={`Delete ${row.item}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300"
                        onClick={() => deleteInventoryItem(row.sku)}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!items.length ? (
              <div className="border-t border-slate-800 py-8 text-center text-sm text-slate-400">
                No stock items have been added yet.
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
                <h2 className="text-xl font-bold">Add stock</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Create a new inventory record for the stock table.
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
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="SKU"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, sku: event.target.value }))
                  }
                  placeholder="OPS-1200"
                  required
                  value={form.sku}
                />
                <Input
                  label="Item name"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, item: event.target.value }))
                  }
                  placeholder="Office chairs"
                  required
                  value={form.item}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Stock quantity"
                  min={0}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stock: event.target.value }))
                  }
                  placeholder="120"
                  required
                  type="number"
                  value={form.stock}
                />
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Location</span>
                  <select
                    className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                    value={form.location}
                  >
                    <option>Warehouse A</option>
                    <option>Warehouse B</option>
                    <option>Warehouse C</option>
                  </select>
                </label>
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
                  <option>Healthy</option>
                  <option>Low</option>
                  <option>Reorder</option>
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
                  <PackagePlus size={18} />
                  Save stock
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default Inventory;
