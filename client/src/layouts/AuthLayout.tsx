import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <section className="hidden min-h-screen flex-col justify-between border-r border-slate-800 bg-slate-900/40 p-10 lg:flex">
          <div className="text-xl font-bold tracking-wide">ERP SYSTEM</div>
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
              Operations Console
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">
              Control teams, inventory, and revenue from one command center.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              A focused workspace for daily decisions, live reporting, and
              secure role-based access.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <strong className="block text-2xl text-white">98%</strong>
              uptime
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <strong className="block text-2xl text-white">24k</strong>
              orders
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <strong className="block text-2xl text-white">12</strong>
              teams
            </div>
          </div>
        </section>
        <main className="flex min-h-screen items-center justify-center p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
