// ==========================================
// CREATE GOAL VALIDATION
// ==========================================

export const validateFinancialGoal = ({
    name,
    targetAmount,
    targetDate
}) => {

    if (!name || !name.trim()) {
        return "Goal name is required";
    }

    if (name.trim().length < 2) {
        return "Goal name must contain at least 2 characters";
    }

    if (
        targetAmount === undefined ||
        targetAmount === null ||
        Number(targetAmount) <= 0
    ) {
        return "Target amount must be greater than 0";
    }

    if (!targetDate) {
        return "Target date is required";
    }

    const parsedDate = new Date(targetDate);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Invalid target date";
    }

    if (parsedDate <= new Date()) {
        return "Target date must be in the future";
    }

    return null;
};