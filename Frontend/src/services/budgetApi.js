const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000/api/v1`
    : "http://localhost:5000/api/v1");

const getAuthHeaders = () => {
  const rawToken = localStorage.getItem("token");
  const token =
    rawToken && rawToken !== "undefined" && rawToken !== "null"
      ? rawToken
      : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getBudgets = async () => {
  const response = await fetch(`${API_URL}/budgets`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch budgets.");
  }
  return data.budgets || data.data || [];
};

export const getBudgetProgress = async (id) => {
  const response = await fetch(`${API_URL}/budgets/${id}/progress`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch budget progress.");
  }
  return data.progress || data.data || data;
};

export const createBudget = async (budgetData) => {
  const response = await fetch(`${API_URL}/budgets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create budget.");
  }
  return data.budget || data.data;
};

export const updateBudget = async (id, budgetData) => {
  const response = await fetch(`${API_URL}/budgets/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(budgetData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update budget.");
  }
  return data.budget || data.data;
};

export const deleteBudget = async (id) => {
  const response = await fetch(`${API_URL}/budgets/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete budget.");
  }
  return data;
};
