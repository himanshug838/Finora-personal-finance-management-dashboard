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

export const getTransactions = async () => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch transactions.");
  }
  return data.transactions || data.data || [];
};

export const createTransaction = async (transactionData) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(transactionData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create transaction.");
  }
  return data.transaction || data.data;
};

export const deleteTransaction = async (id) => {
  const response = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete transaction.");
  }
  return data;
};
