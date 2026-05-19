import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Package,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const searchableItems = [
  {
    title: "Dashboard",
    description: "System overview",
    path: "/",
    section: "Dashboard",
    keywords: "overview home dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    description: "Team directory",
    path: "/employees",
    section: "Employees",
    keywords: "employees people team staff directory",
    icon: Users,
  },
  {
    title: "Inventory",
    description: "Stock levels",
    path: "/inventory",
    section: "Inventory",
    keywords: "inventory stock warehouse supply items",
    icon: Package,
  },
  {
    title: "Finance",
    description: "Invoices and payments",
    path: "/finance",
    section: "Finance",
    keywords: "finance invoices payments transactions",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    description: "Business performance",
    path: "/analytics",
    section: "Analytics",
    keywords: "analytics reports performance charts",
    icon: BarChart3,
  },
];

type Props = {
  className?: string;
};

const GlobalSearch = ({ className }: Props) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return searchableItems
      .filter((item) =>
        `${item.title} ${item.description} ${item.section} ${item.keywords}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 6);
  }, [query]);

  const selectResult = (path: string) => {
    navigate(path);
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setQuery("");
      setIsOpen(false);
    }

    if (event.key === "Enter" && results[0]) {
      selectResult(results[0].path);
    }
  };

  return (
    <div className={clsx("relative max-w-md flex-1", className)}>
      <Search className="pointer-events-none absolute left-3 top-3 text-slate-500" size={17} />
      <input
        className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900 px-9 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search sections..."
        type="search"
        value={query}
      />

      {isOpen && query ? (
        <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/40">
          {results.length ? (
            <div className="max-h-80 overflow-y-auto py-2">
              {results.map((result) => {
                const Icon = result.icon;

                return (
                  <button
                    className="flex w-full items-start gap-3 px-3 py-3 text-left transition hover:bg-slate-900"
                    key={`${result.section}-${result.title}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectResult(result.path)}
                    type="button"
                  >
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">
                        {result.title}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {result.section} - {result.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-slate-400">
              No sections found for "{query}".
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default GlobalSearch;
