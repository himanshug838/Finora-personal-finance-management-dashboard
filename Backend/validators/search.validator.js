const allowedTypes = [
    "all",
    "transaction",
    "account",
    "investment",
    "budget",
    "goal",
    "recurring",
];

const allowedSortOrders = [
    "asc",
    "desc",
];

const isValidDate = (value) => {
    if (!value) {
        return true;
    }

    const date = new Date(value);

    return !Number.isNaN(date.getTime());
};

export const validateSearchQuery = (req, res, next) => {
    const {
        type = "all",
        minAmount,
        maxAmount,
        startDate,
        endDate,
        page = 1,
        limit = 20,
        sortOrder = "desc",
    } = req.query;

    if (!allowedTypes.includes(type)) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid type. Allowed values: all, transaction, account, investment, budget, goal, recurring.",
        });
    }

    if (
        minAmount !== undefined &&
        (
            Number.isNaN(Number(minAmount)) ||
            Number(minAmount) < 0
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "minAmount must be a valid positive number.",
        });
    }

    if (
        maxAmount !== undefined &&
        (
            Number.isNaN(Number(maxAmount)) ||
            Number(maxAmount) < 0
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "maxAmount must be a valid positive number.",
        });
    }

    if (
        minAmount !== undefined &&
        maxAmount !== undefined &&
        Number(minAmount) > Number(maxAmount)
    ) {
        return res.status(400).json({
            success: false,
            message:
                "minAmount cannot be greater than maxAmount.",
        });
    }

    if (!isValidDate(startDate)) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid startDate. Use YYYY-MM-DD format.",
        });
    }

    if (!isValidDate(endDate)) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid endDate. Use YYYY-MM-DD format.",
        });
    }

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({
                success: false,
                message:
                    "startDate cannot be greater than endDate.",
            });
        }
    }

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (
        !Number.isInteger(parsedPage) ||
        parsedPage < 1
    ) {
        return res.status(400).json({
            success: false,
            message: "page must be a positive integer.",
        });
    }

    if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 100
    ) {
        return res.status(400).json({
            success: false,
            message:
                "limit must be an integer between 1 and 100.",
        });
    }

    if (!allowedSortOrders.includes(sortOrder)) {
        return res.status(400).json({
            success: false,
            message:
                "sortOrder must be either asc or desc.",
        });
    }

    next();
};