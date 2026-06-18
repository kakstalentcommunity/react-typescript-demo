export const parseMoney = (value: string) => Number(value.replace(/[KSH,]/g, ""));

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ksh",
    maximumFractionDigits: 0,
  }).format(value);
