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
        Authorization: `Bearer ${token}`
    };
};


// ==========================================
// GET ALL FINANCIAL GOALS
// ==========================================

export const getFinancialGoals = async ({
    status = "",
    category = ""
} = {}) => {

    const params = new URLSearchParams();

    if (status) {
        params.append("status", status);
    }

    if (category) {
        params.append("category", category);
    }

    const queryString =
        params.toString();

    const response = await fetch(
        `${API_URL}/goals${
            queryString
                ? `?${queryString}`
                : ""
        }`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch financial goals."
        );
    }

    return data.data || [];
};


// ==========================================
// GET GOAL SUMMARY
// ==========================================

export const getFinancialGoalSummary =
    async () => {

        const response = await fetch(
            `${API_URL}/goals/summary`,
            {
                method: "GET",
                headers: getAuthHeaders()
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to fetch goal summary."
            );
        }

        return data.data;
    };


// ==========================================
// CREATE GOAL
// ==========================================

export const createFinancialGoal =
    async (goalData) => {

        const response = await fetch(
            `${API_URL}/goals`,
            {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(goalData)
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to create financial goal."
            );
        }

        return data.data;
    };


// ==========================================
// UPDATE GOAL
// ==========================================

export const updateFinancialGoal =
    async (goalId, goalData) => {

        const response = await fetch(
            `${API_URL}/goals/${goalId}`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(goalData)
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to update financial goal."
            );
        }

        return data.data;
    };


// ==========================================
// ADD MONEY
// ==========================================

export const addMoneyToGoal =
    async (goalId, amount) => {

        const response = await fetch(
            `${API_URL}/goals/${goalId}/add-money`,
            {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    amount: Number(amount)
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to add money to goal."
            );
        }

        return data.data;
    };


// ==========================================
// WITHDRAW MONEY
// ==========================================

export const withdrawMoneyFromGoal =
    async (goalId, amount) => {

        const response = await fetch(
            `${API_URL}/goals/${goalId}/withdraw`,
            {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    amount: Number(amount)
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to withdraw money from goal."
            );
        }

        return data.data;
    };


// ==========================================
// DELETE GOAL
// ==========================================

export const deleteFinancialGoal =
    async (goalId) => {

        const response = await fetch(
            `${API_URL}/goals/${goalId}`,
            {
                method: "DELETE",
                headers: getAuthHeaders()
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to delete financial goal."
            );
        }

        return data;
    };