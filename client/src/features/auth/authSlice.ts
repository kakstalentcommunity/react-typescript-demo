import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getCurrentUserRequest,
  loginRequest,
  registerRequest,
} from "./authAPI";
import type {
  AuthResponse,
  AuthStatus,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "./authTypes";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
};

const storedToken = localStorage.getItem("erp_token");

const initialState: AuthState = {
  user: null,
  token: storedToken,
  status: storedToken ? "loading" : "idle",
  error: null,
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    return await loginRequest(credentials);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>("auth/registerUser", async (credentials, { rejectWithValue }) => {
  try {
    return await registerRequest(credentials);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loadCurrentUser = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("auth/loadCurrentUser", async (_, { rejectWithValue }) => {
  try {
    return await getCurrentUserRequest();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("erp_token");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "authenticated";
        localStorage.setItem("erp_token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Unable to sign in.";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "authenticated";
        localStorage.setItem("erp_token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Unable to create account.";
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "authenticated";
        localStorage.setItem("erp_token", action.payload.token);
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        localStorage.removeItem("erp_token");
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;

export default authSlice.reducer;
