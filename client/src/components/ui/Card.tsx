import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

const Card = ({ children, className }: Props) => {
  return (
    <div
      className={clsx(
        "rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
