type Props = {
  label?: string;
};

const Loader = ({ label = "Loading" }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
        <span className="h-5 w-5 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

export default Loader;
