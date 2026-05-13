import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../store/authStore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await register(email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
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
          <label className="label">Create your account</label>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            className="input validator bg-shteam-light-comp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <p className="validator-hint hidden">Required</p>
        </fieldset>

        <label className="fieldset">
          <span className="label">Password</span>
          <input
            type="password"
            className="input validator bg-shteam-light-comp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <span className="validator-hint hidden">Required</span>
        </label>

        <label className="fieldset">
          <span className="label">Confirm password</span>
          <input
            type="password"
            className="input validator bg-shteam-light-comp"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />
          <span className="validator-hint hidden">Required</span>
        </label>

        <button className="btn btn-neutral mt-4 bg-navy-button" type="submit">
          Create Account
        </button>
      </form>
      <label className="label">
        Already have an account?{" "}
        <Link to="/login" className="link text-navy-button">
          Sign in
        </Link>
      </label>
    </AuthLayout>
  );
};

export default Register;
