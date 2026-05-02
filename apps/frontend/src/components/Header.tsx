import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = ({ type }: { type: string }) => {
  const profileOption = type === "signup" ? "Sign up" : "Logout";

  return (
    <header className="navbar bg-shteam-comp shadow-sm px-4">
      <div className="flex-1 flex items-center">
        <img src={logo} className="w-8 aspect-square object-contain" />
        <Link to="/" className="btn btn-ghost text-xl hover:bg-transparent">
          SHteam
        </Link>
      </div>
      <div className="flex gap-2">
        <label className="input bg-shteam-input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" required placeholder="Search shaders..." />
        </label>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Store</Link>
            </li>
            <li>
              <Link to="/library">Library</Link>
            </li>
          </ul>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Profile img"
                src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Aneka"
              />
            </div>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <Link to="/login">{profileOption}</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
