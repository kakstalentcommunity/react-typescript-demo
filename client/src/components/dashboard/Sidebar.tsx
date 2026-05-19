import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  BarChart3,
  Building2,
  X,
} from "lucide-react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Employees", path: "/employees" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: CreditCard, label: "Finance", path: "/finance" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
];

type Props = {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
  <>
    <div className="mb-9 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400 text-slate-950">
        <Building2 size={21} />
      </div>
      <div>
        <h1 className="font-bold leading-none">ERP SYSTEM</h1>
        <p className="mt-1 text-xs text-slate-500">Admin console</p>
      </div>
    </div>

    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            className={({ isActive }) =>
              clsx(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition",
                isActive
                  ? "bg-sky-400 text-slate-950"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )
            }
            key={item.label}
            onClick={onNavigate}
            to={item.path}
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  </>
);

const Sidebar = ({ isMobileOpen = false, onMobileClose }: Props) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-slate-800 bg-slate-950 p-5 lg:block">
        <SidebarContent />
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={onMobileClose}
            type="button"
          />
          <aside className="relative h-full w-[min(320px,86vw)] border-r border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-slate-950">
            <button
              aria-label="Close navigation"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400"
              onClick={onMobileClose}
              type="button"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={onMobileClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
