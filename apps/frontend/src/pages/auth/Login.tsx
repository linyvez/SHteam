import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/catalog");
    } catch (err: any) {
      setError(
        err.message || "Failed to login. Please check your credentials.",
      );
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-shteam-input border-base-300 rounded-box w-xs border p-4"
      >
        <div className="flex flex-col items-center mb-8 gap-1">
          <img src={logo} className="w-20 aspect-square object-contain" />
          <h1 className="text-2xl">
            <b>SHteam</b>
          </h1>
          <label className="label">Sign in to continue</label>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            className="input bg-shteam-light-comp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </fieldset>

        <label className="fieldset">
          <span className="label">Password</span>
          <input
            type="password"
            className="input bg-shteam-light-comp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>

        <button className="btn btn-neutral mt-4 bg-navy-button" type="submit">
          Sign in
        </button>
      </form>
      <label className="label">
        Don't have an account?{" "}
        <Link to="/register" className="link text-navy-button">
          Create one
        </Link>
      </label>
    </AuthLayout>
  );
};

export default Login;
