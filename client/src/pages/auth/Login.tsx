import type { FormEvent } from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { loginUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, status, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dispatch(loginUser({ email, password })).unwrap();
    navigate("/");
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-sky-300">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold">Sign in</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            autoComplete="email"
            label="Email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
            type="email"
            value={email}
          />
          <Input
            autoComplete="current-password"
            label="Password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />

          {error ? (
            <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <Button className="w-full" isLoading={status === "loading"} size="lg">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New workspace?{" "}
          <Link className="font-semibold text-sky-300 hover:text-sky-200" to="/register">
            Create an account
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default Login;
