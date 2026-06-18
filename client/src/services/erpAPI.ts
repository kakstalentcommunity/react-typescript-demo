import api from "./axios";
import { formatMoney } from "../utils/money";
import type { Employee, InventoryItem, Transaction } from "../data/systemData";

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data } = await api.get<Employee[]>("/employees");
  return data;
};

export const createEmployee = async (employee: Employee): Promise<Employee> => {
  const { data } = await api.post<Employee>("/employees", employee);
  return data;
};

export const deleteEmployeeByEmail = async (email: string): Promise<void> => {
  await api.delete(`/employees/email/${encodeURIComponent(email)}`);
};

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data } = await api.get<InventoryItem[]>("/inventory");
  return data;
};

export const createInventoryItem = async (item: InventoryItem): Promise<InventoryItem> => {
  const { data } = await api.post<InventoryItem>("/inventory", item);
  return data;
};

export const deleteInventoryItemBySku = async (sku: string): Promise<void> => {
  await api.delete(`/inventory/sku/${encodeURIComponent(sku)}`);
};

interface FinanceRecordResponse {
  id: string;
  vendor: string;
  amount: number;
  status: string;
  date: string;
}

export const fetchFinance = async (): Promise<Transaction[]> => {
  const { data } = await api.get<FinanceRecordResponse[]>("/finance");

  return data.map((record) => ({
    id: record.id,
    vendor: record.vendor,
    amount: formatMoney(record.amount),
    status: record.status,
    date: record.date.split("T")[0],
  }));
};

export const createFinanceRecord = async (
  transaction: Omit<Transaction, "id">,
): Promise<Transaction> => {
  const { vendor, amount, status, date } = transaction;
  const numericAmount = Number(amount.replace(/[^0-9.-]+/g, ""));
  const { data } = await api.post<FinanceRecordResponse>("/finance", {
    vendor,
    amount: numericAmount,
    status,
    date,
  });

  return {
    id: data.id,
    vendor: data.vendor,
    amount: formatMoney(data.amount),
    status: data.status,
    date: data.date.split("T")[0],
  };
};

export const deleteFinanceRecord = async (id: string): Promise<void> => {
  await api.delete(`/finance/${encodeURIComponent(id)}`);
};
