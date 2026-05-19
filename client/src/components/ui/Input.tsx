import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = ({ className, error, id, label, ...props }: Props) => {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      {label ? (
        <span className="text-sm font-medium text-slate-300">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={clsx(
          "h-11 w-full rounded-lg border bg-slate-950/70 px-3 text-sm text-white outline-none transition",
          "placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20",
          error ? "border-rose-400" : "border-slate-800",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
};

export default Input;
