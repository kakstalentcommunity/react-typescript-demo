import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />

      <div className="min-h-screen lg:pl-[260px]">
        <Navbar onMenuClick={() => setIsMobileNavOpen(true)} />

        <main className="p-3 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
