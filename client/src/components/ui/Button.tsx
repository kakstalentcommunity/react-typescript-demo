import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

const Button = ({
  className,
  children,
  disabled,
  isLoading = false,
  size = "md",
  variant = "primary",
  ...props
}: Props) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold outline-none transition",
        "focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        "disabled:cursor-not-allowed disabled:opacity-60",
        {
          "h-9 px-3 text-sm": size === "sm",
          "h-11 px-4 text-sm": size === "md",
          "h-12 px-5 text-base": size === "lg",
          "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20 hover:bg-sky-400":
            variant === "primary",
          "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800":
            variant === "secondary",
          "text-slate-300 hover:bg-slate-900 hover:text-white":
            variant === "ghost",
          "bg-rose-500 text-white hover:bg-rose-400": variant === "danger",
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
