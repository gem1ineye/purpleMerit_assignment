import { useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { currentUser, token, refreshMe } = useAuth();
  const [form, setForm] = useState({ name: currentUser?.name || "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await apiClient.updateMe(
        {
          name: form.name,
          ...(form.password ? { password: form.password } : {})
        },
        token
      );
      await refreshMe(token);
      setForm((previous) => ({ ...previous, password: "" }));
      setMessage("Profile updated successfully");
    } catch (requestError) {
      setError(requestError.message || "Update failed");
    }
  };

  return (
    <section>
      <h1>My Profile</h1>
      <p>You can update your name and password only.</p>

      <form className="form-grid narrow" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          New Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </label>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <button className="btn" type="submit">
          Save Changes
        </button>
      </form>
    </section>
  );
};

export default ProfilePage;
