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
import {
  createEmployee,
  createFinanceRecord,
  createInventoryItem,
  deleteEmployeeByEmail,
  deleteFinanceRecord,
  deleteInventoryItemBySku,
  fetchEmployees,
  fetchFinance,
  fetchInventory,
} from "../services/erpAPI";

type AppDataContextValue = {
  employees: Employee[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  addEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (email: string) => Promise<void>;
  addInventoryItem: (item: InventoryItem) => Promise<void>;
  deleteInventoryItem: (sku: string) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
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
    const token = localStorage.getItem("erp_token");

    if (!token) {
      return;
    }

    const loadData = async () => {
      try {
        const [employeeData, inventoryData, financeData] = await Promise.all([
          fetchEmployees(),
          fetchInventory(),
          fetchFinance(),
        ]);

        setEmployees(employeeData);
        setInventory(inventoryData);
        setTransactions(financeData);
      } catch (error) {
        console.error("Failed to load ERP data:", error);
      }
    };

    void loadData();
  }, []);

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
      addEmployee: async (employee) => {
        try {
          const savedEmployee = await createEmployee(employee);
          setEmployees((currentEmployees) => [savedEmployee, ...currentEmployees]);
        } catch (error) {
          console.error("Failed to create employee:", error);
        }
      },
      deleteEmployee: async (email) => {
        try {
          await deleteEmployeeByEmail(email);
          setEmployees((currentEmployees) =>
            currentEmployees.filter((employee) => employee.email !== email)
          );
        } catch (error) {
          console.error("Failed to delete employee:", error);
        }
      },
      addInventoryItem: async (item) => {
        try {
          const savedItem = await createInventoryItem(item);
          setInventory((currentInventory) => [savedItem, ...currentInventory]);
        } catch (error) {
          console.error("Failed to create inventory item:", error);
        }
      },
      deleteInventoryItem: async (sku) => {
        try {
          await deleteInventoryItemBySku(sku);
          setInventory((currentInventory) =>
            currentInventory.filter((item) => item.sku !== sku)
          );
        } catch (error) {
          console.error("Failed to delete inventory item:", error);
        }
      },
      addTransaction: async (transaction) => {
        try {
          const savedInvoice = await createFinanceRecord(transaction);
          setTransactions((currentTransactions) => [savedInvoice, ...currentTransactions]);
        } catch (error) {
          console.error("Failed to create finance transaction:", error);
        }
      },
      deleteTransaction: async (id) => {
        try {
          await deleteFinanceRecord(id);
          setTransactions((currentTransactions) =>
            currentTransactions.filter((transaction) => transaction.id !== id)
          );
        } catch (error) {
          console.error("Failed to delete finance transaction:", error);
        }
      },
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
