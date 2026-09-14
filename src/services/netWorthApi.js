const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000/api/v1`
    : "http://localhost:5000/api/v1");


const getAuthHeaders = () => {

    const rawToken =
        localStorage.getItem("token");

    const token =
        (rawToken && rawToken !== "undefined" && rawToken !== "null") ? rawToken : "";


    return {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    };
};


// ==========================================
// CURRENT NET WORTH
// ==========================================

export const getNetWorth = async () => {

    const response = await fetch(
        `${API_URL}/net-worth`,
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
            "Failed to fetch net worth"
        );

    }


    return data.data;
};



// ==========================================
// BREAKDOWN
// ==========================================

export const getNetWorthBreakdown = async () => {

    const response = await fetch(
        `${API_URL}/net-worth/breakdown`,
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
            "Failed to fetch net worth breakdown"
        );

    }


    return data.data;
};



// ==========================================
// SUMMARY
// ==========================================

export const getNetWorthSummary = async () => {

    const response = await fetch(
        `${API_URL}/net-worth/summary`,
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
            "Failed to fetch net worth summary"
        );

    }


    return data.data;
};



// ==========================================
// REAL NET WORTH HISTORY
// ==========================================

export const getNetWorthHistory = async (
    months = 6
) => {

    const response = await fetch(
        `${API_URL}/net-worth/history?months=${months}`,
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
            "Failed to fetch net worth history"
        );

    }


    return data.data;
};



// ==========================================
// CREATE SNAPSHOT
// ==========================================

export const createNetWorthSnapshot =
    async () => {

        const response = await fetch(
            `${API_URL}/net-worth-snapshots`,
            {
                method: "POST",

                headers: getAuthHeaders()
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to create net worth snapshot"
            );

        }


        return data.data;
    };



// ==========================================
// GET LATEST SNAPSHOT
// ==========================================

export const getLatestSnapshot =
    async () => {

        const response = await fetch(
            `${API_URL}/net-worth-snapshots/latest`,
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
                "Failed to fetch latest snapshot"
            );

        }


        return data.data;
    };