import { useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const initialFilters = {
  page: 1,
  limit: 8,
  search: "",
  role: "",
  status: ""
};

const UsersPage = () => {
  const { token, currentUser } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    status: "active"
  });

  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "User",
    status: "active"
  });

  const canCreate = currentUser?.role === "Admin";
  const canDeactivate = currentUser?.role === "Admin";
  const canEdit = currentUser?.role === "Admin" || currentUser?.role === "Manager";

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.getUsers(filters, token);
      setUsers(response.items);
      setPagination(response.pagination);
    } catch (requestError) {
      setError(requestError.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.limit, filters.role, filters.status]);

  const submitSearch = (event) => {
    event.preventDefault();
    setFilters((previous) => ({ ...previous, page: 1 }));
    fetchUsers();
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await apiClient.createUser(
        {
          name: createForm.name,
          email: createForm.email,
          role: createForm.role,
          status: createForm.status,
          ...(createForm.password ? { password: createForm.password } : {})
        },
        token
      );
      setCreateForm({ name: "", email: "", password: "", role: "User", status: "active" });
      await fetchUsers();
    } catch (requestError) {
      setError(requestError.message || "Failed to create user");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await apiClient.deactivateUser(id, token);
      await fetchUsers();
    } catch (requestError) {
      setError(requestError.message || "Failed to deactivate user");
    }
  };

  const startEdit = (user) => {
    setEditForm({
      id: user._id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      await apiClient.updateUser(
        editForm.id,
        {
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
          status: editForm.status,
          ...(editForm.password ? { password: editForm.password } : {})
        },
        token
      );

      setEditForm({
        id: "",
        name: "",
        email: "",
        password: "",
        role: "User",
        status: "active"
      });

      await fetchUsers();
    } catch (requestError) {
      setError(requestError.message || "Failed to update user");
    }
  };

  const visibleUsers = useMemo(() => users, [users]);

  return (
    <section>
      <h1>User Management</h1>
      <p>Browse, filter, and manage users based on your role permissions.</p>

      <form className="toolbar" onSubmit={submitSearch}>
        <input
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(event) => setFilters((previous) => ({ ...previous, search: event.target.value }))}
        />

        <select value={filters.role} onChange={(event) => setFilters((previous) => ({ ...previous, role: event.target.value, page: 1 }))}>
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
        </select>

        <select value={filters.status} onChange={(event) => setFilters((previous) => ({ ...previous, status: event.target.value, page: 1 }))}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="btn" type="submit">
          Search
        </button>
      </form>

      {canCreate && (
        <form className="form-grid card" onSubmit={handleCreate}>
          <h3>Create New User</h3>
          <input
            placeholder="Name"
            value={createForm.name}
            onChange={(event) => setCreateForm((previous) => ({ ...previous, name: event.target.value }))}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={createForm.email}
            onChange={(event) => setCreateForm((previous) => ({ ...previous, email: event.target.value }))}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={createForm.password}
            onChange={(event) => setCreateForm((previous) => ({ ...previous, password: event.target.value }))}
          />
          <select value={createForm.role} onChange={(event) => setCreateForm((previous) => ({ ...previous, role: event.target.value }))}>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
          <select value={createForm.status} onChange={(event) => setCreateForm((previous) => ({ ...previous, status: event.target.value }))}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <button className="btn" type="submit">
            Create User
          </button>
        </form>
      )}

      {editForm.id && (
        <form className="form-grid card" onSubmit={handleUpdate}>
          <h3>Edit User</h3>
          <input
            placeholder="Name"
            value={editForm.name}
            onChange={(event) => setEditForm((previous) => ({ ...previous, name: event.target.value }))}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={editForm.email}
            onChange={(event) => setEditForm((previous) => ({ ...previous, email: event.target.value }))}
            required
          />
          <input
            placeholder="Set new password (optional)"
            type="password"
            value={editForm.password}
            onChange={(event) => setEditForm((previous) => ({ ...previous, password: event.target.value }))}
          />
          <select value={editForm.role} onChange={(event) => setEditForm((previous) => ({ ...previous, role: event.target.value }))}>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
          <select value={editForm.status} onChange={(event) => setEditForm((previous) => ({ ...previous, status: event.target.value }))}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          <div className="toolbar">
            <button className="btn" type="submit">
              Save User
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() =>
                setEditForm({ id: "", name: "", email: "", password: "", role: "User", status: "active" })
              }
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p>Loading users...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  {canEdit && !(currentUser?.role === "Manager" && user.role === "Admin") && (
                    <button className="btn ghost" onClick={() => startEdit(user)} type="button">
                      Edit
                    </button>
                  )}
                  {canDeactivate && user.status === "active" && (
                    <button className="btn danger" onClick={() => handleDeactivate(user._id)} type="button">
                      Deactivate
                    </button>
                  )}
                  {!canDeactivate && <span className="muted">No admin actions</span>}
                </td>
              </tr>
            ))}
            {!visibleUsers.length && !loading && (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <button
          className="btn ghost"
          disabled={pagination.page <= 1}
          onClick={() => setFilters((previous) => ({ ...previous, page: previous.page - 1 }))}
          type="button"
        >
          Previous
        </button>
        <span>
          Page {pagination.page} / {pagination.totalPages} (Total: {pagination.total})
        </span>
        <button
          className="btn ghost"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setFilters((previous) => ({ ...previous, page: previous.page + 1 }))}
          type="button"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default UsersPage;
