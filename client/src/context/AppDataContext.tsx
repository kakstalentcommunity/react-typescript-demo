import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  employees as initialEmployees,
  inventory as initialInventory,
  transactions as initialTransactions,
} from "../data/systemData";
import type { Employee, InventoryItem, Transaction } from "../data/systemData";

type AppDataContextValue = {
  employees: Employee[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  addEmployee: (employee: Employee) => void;
  deleteEmployee: (email: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (sku: string) => void;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

const loadStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

type Props = {
  children: ReactNode;
};

export const AppDataProvider = ({ children }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadStored("erp_employees", initialEmployees)
  );
  const [inventory, setInventory] = useState<InventoryItem[]>(() =>
    loadStored("erp_inventory", initialInventory)
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadStored("erp_transactions", initialTransactions)
  );

  useEffect(() => {
    localStorage.setItem("erp_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("erp_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("erp_transactions", JSON.stringify(transactions));
  }, [transactions]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      employees,
      inventory,
      transactions,
      addEmployee: (employee) =>
        setEmployees((currentEmployees) => [employee, ...currentEmployees]),
      deleteEmployee: (email) =>
        setEmployees((currentEmployees) =>
          currentEmployees.filter((employee) => employee.email !== email)
        ),
      addInventoryItem: (item) =>
        setInventory((currentInventory) => [item, ...currentInventory]),
      deleteInventoryItem: (sku) =>
        setInventory((currentInventory) =>
          currentInventory.filter((item) => item.sku !== sku)
        ),
      addTransaction: (transaction) =>
        setTransactions((currentTransactions) => [
          transaction,
          ...currentTransactions,
        ]),
      deleteTransaction: (id) =>
        setTransactions((currentTransactions) =>
          currentTransactions.filter((transaction) => transaction.id !== id)
        ),
    }),
    [employees, inventory, transactions]
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }

  return context;
};
