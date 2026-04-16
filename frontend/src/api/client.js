const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const buildHeaders = (token, includeJson = true) => {
  const headers = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async (path, { method = "GET", body, token } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

const apiClient = {
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  getMe: (token) => request("/users/me", { token }),
  updateMe: (payload, token) => request("/users/me", { method: "PUT", body: payload, token }),
  getUsers: (params, token) => {
    const sanitizedParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined)
    );
    const query = new URLSearchParams(sanitizedParams).toString();
    return request(`/users?${query}`, { token });
  },
  getUserById: (id, token) => request(`/users/${id}`, { token }),
  createUser: (payload, token) => request("/users", { method: "POST", body: payload, token }),
  updateUser: (id, payload, token) => request(`/users/${id}`, { method: "PUT", body: payload, token }),
  deactivateUser: (id, token) => request(`/users/${id}`, { method: "DELETE", token })
};

export default apiClient;
