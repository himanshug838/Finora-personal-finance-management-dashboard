const isValidDate = (value) => {
    if (!value) return false;

    const date = new Date(value);

    return !Number.isNaN(date.getTime());
};

export const validateAnalyticsDateRange = (req, res, next) => {
    const { startDate, endDate } = req.query;

    if (startDate && !isValidDate(startDate)) {
        return res.status(400).json({
            success: false,
            message: "Invalid startDate. Use YYYY-MM-DD format."
        });
    }

    if (endDate && !isValidDate(endDate)) {
        return res.status(400).json({
            success: false,
            message: "Invalid endDate. Use YYYY-MM-DD format."
        });
    }

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({
                success: false,
                message: "startDate cannot be greater than endDate."
            });
        }
    }

    next();
};


export const validateMonths = (req, res, next) => {
    const months = Number(req.query.months);

    if (
        req.query.months !== undefined &&
        (!Number.isInteger(months) || months < 1 || months > 24)
    ) {
        return res.status(400).json({
            success: false,
            message: "months must be an integer between 1 and 24."
        });
    }

    next();
};