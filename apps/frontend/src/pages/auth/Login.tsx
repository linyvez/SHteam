import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";

const Login = () => {
  return (
    <AuthLayout>
      <form className="fieldset bg-shteam-input border-base-300 rounded-box w-xs border p-4">
        <div className="flex flex-col items-center mb-8 gap-1">
          <img src={logo} className="w-20 aspect-square object-contain" />
          <h1 className="text-2xl">
            <b>SHteam</b>
          </h1>
          <label className="label">Sign in to continue</label>
        </div>

        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            className="input bg-shteam-light-comp"
            placeholder="Email"
            required
          />
        </fieldset>

        <label className="fieldset">
          <span className="label">Password</span>
          <input
            type="password"
            className="input bg-shteam-light-comp"
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
