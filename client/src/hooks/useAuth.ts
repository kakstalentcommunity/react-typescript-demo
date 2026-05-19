import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const useAuth = () => {
  return useSelector((state: RootState) => state.auth);
};

export default useAuth;
