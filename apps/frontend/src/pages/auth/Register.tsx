import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";

const Register = () => {
  return (
    <AuthLayout>
      <form className="fieldset bg-shteam-input border-base-300 rounded-box w-xs border p-4">
        <div className="flex flex-col items-center mb-8 gap-1">
          <img src={logo} className="w-20 aspect-square object-contain" />
          <h1 className="text-2xl">
            <b>SHteam</b>
          </h1>
          <label className="label">Create your account</label>
        </div>

        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input
            type="email"
            className="input validator bg-shteam-light-comp"
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
