const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000/api/v1`
    : "http://localhost:5000/api/v1");

const getAuthHeaders = () => {
  const rawToken = localStorage.getItem("token");
  const token = (rawToken && rawToken !== "undefined" && rawToken !== "null") ? rawToken : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getAccounts = async () => {
  const response = await fetch(`${API_URL}/accounts`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch accounts.");
  }
  return data.accounts || data.data || [];
};

export const createAccount = async (accountData) => {
  const response = await fetch(`${API_URL}/accounts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(accountData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create account.");
  }
  return data.account || data.data;
};

export const deleteAccount = async (id) => {
  const response = await fetch(`${API_URL}/accounts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete account.");
  }
  return data;
};
