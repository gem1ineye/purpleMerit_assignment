import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
    } catch (requestError) {
      setError(requestError.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <h1>Role-Based User Management</h1>
        <p>Log in with your email or username and continue.</p>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Email or Username
            <input
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
