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

export const getInvestments = async () => {
  const response = await fetch(`${API_URL}/investments`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch investments.");
  }
  return data.investments || data.data || [];
};

export const createInvestment = async (investmentData) => {
  const response = await fetch(`${API_URL}/investments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(investmentData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to add investment.");
  }
  return data.investment || data.data;
};

export const deleteInvestment = async (id) => {
  const response = await fetch(`${API_URL}/investments/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete investment.");
  }
  return data;
};
