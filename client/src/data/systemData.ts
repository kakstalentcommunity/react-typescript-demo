export type Employee = {
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
};

export type InventoryItem = {
  sku: string;
  item: string;
  stock: number;
  location: string;
  status: string;
};

export type Transaction = {
  id: string;
  vendor: string;
  amount: string;
  status: string;
  date: string;
};

export type AnalyticsScore = {
  name: string;
  score: number;
};

export const employees: Employee[] = [];

export const inventory: InventoryItem[] = [];

export const transactions: Transaction[] = [];

export const analyticsScores: AnalyticsScore[] = [];
