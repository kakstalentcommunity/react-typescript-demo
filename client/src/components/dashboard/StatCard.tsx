import type { LucideIcon } from "lucide-react";
import Card from "../ui/Card";

type Props = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

const StatCard = ({ change, icon: Icon, title, value }: Props) => {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-emerald-300">{change}</p>
    </Card>
  );
};

export default StatCard;
