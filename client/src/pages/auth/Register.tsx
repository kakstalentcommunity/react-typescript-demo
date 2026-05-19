import type { FormEvent } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import { registerUser } from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, status, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dispatch(registerUser({ email, name, password })).unwrap();
    navigate("/");
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-sky-300">Start workspace</p>
          <h1 className="mt-2 text-3xl font-bold">Create account</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            autoComplete="name"
            label="Full name"
            name="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Morgan"
            required
            value={name}
          />
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
            autoComplete="new-password"
            label="Password"
            minLength={8}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a secure password"
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
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link className="font-semibold text-sky-300 hover:text-sky-200" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default Register;
