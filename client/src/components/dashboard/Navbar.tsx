import { Bell, Download, LogOut, Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import type { AppDispatch } from "../../app/store";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";
import GlobalSearch from "./GlobalSearch";
import { exportExcel } from "../../utils/exportExcel";
import { useAppData } from "../../context/AppDataContext";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/inventory": "Inventory",
  "/finance": "Finance",
  "/analytics": "Analytics",
};

type Props = {
  onMenuClick: () => void;
};

const Navbar = ({ onMenuClick }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { employees, inventory, transactions } = useAppData();
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Workspace";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 px-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-h-[64px] items-center justify-between gap-3 py-2 sm:h-[70px] sm:py-0">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Open navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 text-slate-300 lg:hidden"
            onClick={onMenuClick}
            type="button"
          >
            <Menu size={19} />
          </button>
          <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="hidden text-sm text-slate-500 sm:block">
            {new Intl.DateTimeFormat("en", {
              dateStyle: "medium",
            }).format(new Date())}
          </p>
          </div>
        </div>

        <GlobalSearch className="hidden md:block" />

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            className="hidden sm:inline-flex"
            onClick={() =>
              exportExcel("erp-system-export", [
                { name: "Employees", rows: employees },
                { name: "Inventory", rows: inventory },
                { name: "Finance", rows: transactions },
                {
                  name: "Analytics",
                  rows: [
                    { metric: "Employees", value: employees.length },
                    { metric: "Inventory items", value: inventory.length },
                    { metric: "Invoices", value: transactions.length },
                  ],
                },
              ])
            }
            size="sm"
            type="button"
            variant="secondary"
          >
            <Download size={16} />
            Export
          </Button>
          <button
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:bg-slate-900 hover:text-white sm:flex"
            type="button"
          >
            <Bell size={18} />
          </button>
          <div className="hidden items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400 text-sm font-bold text-slate-950">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">{user?.name ?? "User"}</p>
              <p className="text-xs text-slate-500">{user?.role ?? "admin"}</p>
            </div>
          </div>
          <Button
            aria-label="Sign out"
            onClick={() => dispatch(logout())}
            size="sm"
            type="button"
            variant="ghost"
          >
            <LogOut size={17} />
          </Button>
        </div>
      </div>
      <div className="pb-3 md:hidden">
        <GlobalSearch className="max-w-none" />
      </div>
    </header>
  );
};

export default Navbar;
