import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Mail, Plus, Search, ShieldCheck, Trash2, Users } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import type { Employee } from "../../data/systemData";
import { exportExcel } from "../../utils/exportExcel";
import { useAppData } from "../../context/AppDataContext";

const initialEmployeeForm = {
  name: "",
  email: "",
  department: "Operations",
  role: "",
  status: "Active",
};

const Employees = () => {
  const { addEmployee, deleteEmployee, employees } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialEmployeeForm);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return employees;
    }

    return employees.filter((employee) =>
      [
        employee.name,
        employee.email,
        employee.department,
        employee.role,
        employee.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [employees, searchQuery]);

  const loadedEmployeeCount = employees.length;
  const loadedRoleCount = useMemo(
    () => new Set(employees.map((employee) => employee.role).filter(Boolean)).size,
    [employees]
  );
  const pendingInviteCount = useMemo(
    () => employees.filter((employee) => employee.status === "Invited").length,
    [employees]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newEmployee: Employee = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      department: form.department,
      role: form.role.trim(),
      status: form.status,
    };

    addEmployee(newEmployee);
    setForm(initialEmployeeForm);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              People
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Employee Directory
            </h1>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setIsModalOpen(true)} type="button">
            <Plus size={18} />
            Add employee
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Employees</span>
              <Users className="text-sky-300" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">{loadedEmployeeCount}</p>
            <p className="mt-2 text-sm text-slate-400">
              {loadedEmployeeCount > 0
                ? `${loadedEmployeeCount} employee${loadedEmployeeCount === 1 ? "" : "s"} loaded`
                : "No employees loaded"}
            </p>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Open roles</span>
              <ShieldCheck className="text-sky-300" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">{loadedRoleCount}</p>
            <p className="mt-2 text-sm text-slate-400">
              {loadedRoleCount > 0
                ? `${loadedRoleCount} role${loadedRoleCount === 1 ? "" : "s"} active`
                : "No open roles"}
            </p>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Invites pending</span>
              <Mail className="text-sky-300" size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">{pendingInviteCount}</p>
            <p className="mt-2 text-sm text-slate-400">
              {pendingInviteCount > 0
                ? `${pendingInviteCount} invite${pendingInviteCount === 1 ? "" : "s"} pending`
                : "No pending invites"}
            </p>
          </Card>
        </div>

        <Card>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold">Team members</h2>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-3 text-slate-500" size={17} />
                <Input
                  className="pl-9"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search employees"
                  type="search"
                  value={searchQuery}
                />
              </div>
              <Button
                className="w-full md:w-auto"
                onClick={() =>
                  exportExcel("employees-export", [
                    { name: "Employees", rows: filteredEmployees },
                  ])
                }
                type="button"
                variant="secondary"
              >
                Export Excel
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-500">
                <tr>
                  <th className="py-3 font-medium">Name</th>
                  <th className="py-3 font-medium">Department</th>
                  <th className="py-3 font-medium">Role</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.email}>
                    <td className="py-4">
                      <div>
                        <p className="font-semibold text-white">{employee.name}</p>
                        <p className="text-slate-500">{employee.email}</p>
                      </div>
                    </td>
                    <td className="py-4 text-slate-300">{employee.department}</td>
                    <td className="py-4 text-slate-300">{employee.role}</td>
                    <td className="py-4">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        aria-label={`Delete ${employee.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300"
                        onClick={() => deleteEmployee(employee.email)}
                        type="button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredEmployees.length ? (
              <div className="border-t border-slate-800 py-8 text-center text-sm text-slate-400">
                {searchQuery
                  ? `No employees match "${searchQuery}".`
                  : "No employees have been added yet."}
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
                <h2 className="text-xl font-bold">Add employee</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Add a new team member to the employee directory.
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
                  label="Full name"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Full Name "
                  required
                  value={form.name}
                />
                <Input
                  label="Email"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="alex@company.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-300">Department</span>
                  <select
                    className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        department: event.target.value,
                      }))
                    }
                    value={form.department}
                  >
                    <option>Operations</option>
                    <option>Finance</option>
                    <option>People</option>
                    <option>Warehouse</option>
                    <option>Sales</option>
                  </select>
                </label>
                <Input
                  label="Role"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, role: event.target.value }))
                  }
                  placeholder="Project Manager"
                  required
                  value={form.role}
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
                  <option>Active</option>
                  <option>Invited</option>
                  <option>Review</option>
                  <option>Onboarding</option>
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
                  <Plus size={18} />
                  Save employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default Employees;
