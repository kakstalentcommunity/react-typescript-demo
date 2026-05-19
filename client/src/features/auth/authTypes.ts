export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";
