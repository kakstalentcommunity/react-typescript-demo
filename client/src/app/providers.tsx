import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AppDataProvider } from "../context/AppDataContext";

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppDataProvider>{children}</AppDataProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
