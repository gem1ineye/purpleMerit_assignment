import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="app">
      <header className="topbar">
        <Link className="brand" to="/dashboard">
          Merit RBAC
        </Link>
        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/profile">My Profile</NavLink>
          {(currentUser?.role === "Admin" || currentUser?.role === "Manager") && <NavLink to="/users">User Management</NavLink>}
        </nav>
        <div className="topbar-right">
          <span className="badge">{currentUser?.role}</span>
          <button className="btn ghost" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
