const validTypes = [
    "income",
    "expense"
];

const validFrequencies = [
    "daily",
    "weekly",
    "monthly",
    "yearly"
];

export const validateRecurringTransaction = (
    data
) => {

    const {
        name,
        account,
        type,
        amount,
        frequency,
        startDate,
        endDate
    } = data;

    if (!name || !name.trim()) {
        return "Recurring transaction name is required.";
    }

    if (!account) {
        return "Account is required.";
    }

    if (!validTypes.includes(type)) {
        return "Type must be income or expense.";
    }

    if (
        amount === undefined ||
        Number(amount) <= 0
    ) {
        return "Amount must be greater than 0.";
    }

    if (!validFrequencies.includes(frequency)) {
        return "Invalid frequency.";
    }

    if (!startDate) {
        return "Start date is required.";
    }

    const parsedStartDate =
        new Date(startDate);

    if (Number.isNaN(parsedStartDate.getTime())) {
        return "Invalid start date.";
    }

    if (endDate) {

        const parsedEndDate =
            new Date(endDate);

        if (
            Number.isNaN(
                parsedEndDate.getTime()
            )
        ) {
            return "Invalid end date.";
        }

        if (
            parsedEndDate < parsedStartDate
        ) {
            return "End date cannot be before start date.";
        }
    }

    return null;
};