import FinancialGoal from "../models/financialGoal.model.js";

import {
    validateFinancialGoal
} from "../validators/financialGoal.validator.js";

// ==========================================
// CREATE FINANCIAL GOAL
// ==========================================

export const createFinancialGoal = async (req, res) => {

    const userId = req.user.id;

    const {
        name,
        description,
        category,
        targetAmount,
        currentAmount,
        currency,
        targetDate
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    const validationError =
        validateFinancialGoal({
            name,
            targetAmount,
            targetDate
        });

    if (validationError) {
        return res.status(400).json({
            success: false,
            message: validationError
        });
    }

    // ==========================================
    // CURRENT AMOUNT VALIDATION
    // ==========================================

    const startingAmount =
        Number(currentAmount) || 0;

    if (startingAmount < 0) {
        return res.status(400).json({
            success: false,
            message: "Current amount cannot be negative"
        });
    }

    if (
        startingAmount >
        Number(targetAmount)
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Current amount cannot exceed target amount"
        });
    }

    // ==========================================
    // CREATE GOAL
    // ==========================================

    const goal = await FinancialGoal.create({

        user: userId,

        name: name.trim(),

        description:
            description?.trim() || "",

        category:
            category || "other",

        targetAmount:
            Number(targetAmount),

        currentAmount:
            startingAmount,

        currency:
            currency || "INR",

        targetDate:
            new Date(targetDate),

        status:
            startingAmount >= Number(targetAmount)
                ? "completed"
                : "active"
    });

    res.status(201).json({

        success: true,

        message:
            "Financial goal created successfully",

        data: goal
    });
};

// ==========================================
// GET ALL FINANCIAL GOALS
// ==========================================

export const getFinancialGoals = async (req, res) => {

    const userId = req.user.id;

    const {
        status,
        category
    } = req.query;

    const filter = {
        user: userId,
        isActive: true
    };

    // ==========================================
    // STATUS FILTER
    // ==========================================

    if (status) {
        filter.status = status;
    }

    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    if (category) {
        filter.category = category;
    }

    const goals =
        await FinancialGoal.find(filter)
            .sort({
                targetDate: 1,
                createdAt: -1
            });

    // ==========================================
    // ADD CALCULATED DATA
    // ==========================================

    const formattedGoals = goals.map(
        (goal) => {

            const target =
                Number(goal.targetAmount) || 0;

            const current =
                Number(goal.currentAmount) || 0;

            const remaining =
                Math.max(
                    target - current,
                    0
                );

            const progress =
                target > 0
                    ? (current / target) * 100
                    : 0;

            return {

                ...goal.toObject(),

                remainingAmount:
                    remaining,

                progressPercentage:
                    Math.min(progress, 100)
            };
        }
    );

    res.status(200).json({

        success: true,

        count:
            formattedGoals.length,

        data:
            formattedGoals
    });
};

// ==========================================
// GET SINGLE FINANCIAL GOAL
// ==========================================

export const getFinancialGoal = async (req, res) => {

    const userId = req.user.id;

    const goalId = req.params.id;

    const goal =
        await FinancialGoal.findOne({
            _id: goalId,
            user: userId,
            isActive: true
        });

    if (!goal) {

        return res.status(404).json({

            success: false,

            message:
                "Financial goal not found"
        });
    }

    const target =
        Number(goal.targetAmount) || 0;

    const current =
        Number(goal.currentAmount) || 0;

    const remaining =
        Math.max(
            target - current,
            0
        );

    const progress =
        target > 0
            ? (current / target) * 100
            : 0;

    res.status(200).json({

        success: true,

        data: {

            ...goal.toObject(),

            remainingAmount:
                remaining,

            progressPercentage:
                Math.min(progress, 100)
        }
    });
};

// ==========================================
// UPDATE FINANCIAL GOAL
// ==========================================

export const updateFinancialGoal = async (req, res) => {

    const userId = req.user.id;

    const goalId = req.params.id;

    const goal =
        await FinancialGoal.findOne({
            _id: goalId,
            user: userId,
            isActive: true
        });

    if (!goal) {

        return res.status(404).json({

            success: false,

            message:
                "Financial goal not found"
        });
    }

    const {
        name,
        description,
        category,
        targetAmount,
        currency,
        targetDate,
        status
    } = req.body;

    // ==========================================
    // UPDATE NAME
    // ==========================================

    if (name !== undefined) {

        if (!name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Goal name cannot be empty"
            });
        }

        goal.name =
            name.trim();
    }

    // ==========================================
    // UPDATE DESCRIPTION
    // ==========================================

    if (description !== undefined) {

        goal.description =
            description.trim();
    }

    // ==========================================
    // UPDATE CATEGORY
    // ==========================================

    if (category !== undefined) {

        goal.category =
            category;
    }

    // ==========================================
    // UPDATE TARGET AMOUNT
    // ==========================================

    if (targetAmount !== undefined) {

        const newTarget =
            Number(targetAmount);

        if (
            !Number.isFinite(newTarget) ||
            newTarget <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Target amount must be greater than 0"
            });
        }

        if (
            newTarget <
            goal.currentAmount
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Target amount cannot be less than current amount"
            });
        }

        goal.targetAmount =
            newTarget;
    }

    // ==========================================
    // UPDATE CURRENCY
    // ==========================================

    if (currency !== undefined) {

        goal.currency =
            currency.toUpperCase();
    }

    // ==========================================
    // UPDATE TARGET DATE
    // ==========================================

    if (targetDate !== undefined) {

        const newDate =
            new Date(targetDate);

        if (
            Number.isNaN(
                newDate.getTime()
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid target date"
            });
        }

        goal.targetDate =
            newDate;
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    if (status !== undefined) {

        const allowedStatuses = [
            "active",
            "completed",
            "paused",
            "cancelled"
        ];

        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid goal status"
            });
        }

        goal.status =
            status;
    }

    // ==========================================
    // AUTO COMPLETE
    // ==========================================

    if (
        goal.currentAmount >=
        goal.targetAmount
    ) {

        goal.currentAmount =
            goal.targetAmount;

        goal.status =
            "completed";
    }

    await goal.save();

    res.status(200).json({

        success: true,

        message:
            "Financial goal updated successfully",

        data: goal
    });
};

// ==========================================
// ADD MONEY TO GOAL
// ==========================================

export const addMoneyToGoal = async (req, res) => {

    const userId = req.user.id;

    const goalId = req.params.id;

    const {
        amount
    } = req.body;

    const addAmount =
        Number(amount);

    if (
        !Number.isFinite(addAmount) ||
        addAmount <= 0
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Amount must be greater than 0"
        });
    }

    const goal =
        await FinancialGoal.findOne({
            _id: goalId,
            user: userId,
            isActive: true
        });

    if (!goal) {

        return res.status(404).json({

            success: false,

            message:
                "Financial goal not found"
        });
    }

    if (
        goal.status === "cancelled"
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Cannot add money to a cancelled goal"
        });
    }

    const newAmount =
        goal.currentAmount +
        addAmount;

    if (
        newAmount >=
        goal.targetAmount
    ) {

        goal.currentAmount =
            goal.targetAmount;

        goal.status =
            "completed";

    } else {

        goal.currentAmount =
            newAmount;

        goal.status =
            "active";
    }

    await goal.save();

    res.status(200).json({

        success: true,

        message:
            "Money added to financial goal",

        data: goal
    });
};

// ==========================================
// WITHDRAW MONEY FROM GOAL
// ==========================================

export const withdrawMoneyFromGoal = async (
    req,
    res
) => {

    const userId = req.user.id;

    const goalId = req.params.id;

    const {
        amount
    } = req.body;

    const withdrawAmount =
        Number(amount);

    if (
        !Number.isFinite(withdrawAmount) ||
        withdrawAmount <= 0
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Amount must be greater than 0"
        });
    }

    const goal =
        await FinancialGoal.findOne({
            _id: goalId,
            user: userId,
            isActive: true
        });

    if (!goal) {

        return res.status(404).json({

            success: false,

            message:
                "Financial goal not found"
        });
    }

    if (
        withdrawAmount >
        goal.currentAmount
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Withdrawal amount exceeds saved amount"
        });
    }

    goal.currentAmount -=
        withdrawAmount;

    // ==========================================
    // REOPEN COMPLETED GOAL
    // ==========================================

    if (
        goal.currentAmount <
        goal.targetAmount &&
        goal.status === "completed"
    ) {

        goal.status =
            "active";
    }

    await goal.save();

    res.status(200).json({

        success: true,

        message:
            "Money withdrawn from financial goal",

        data: goal
    });
};

// ==========================================
// DELETE FINANCIAL GOAL
// ==========================================

export const deleteFinancialGoal = async (
    req,
    res
) => {

    const userId = req.user.id;

    const goalId = req.params.id;

    const goal =
        await FinancialGoal.findOne({
            _id: goalId,
            user: userId,
            isActive: true
        });

    if (!goal) {

        return res.status(404).json({

            success: false,

            message:
                "Financial goal not found"
        });
    }

    // ==========================================
    // SOFT DELETE
    // ==========================================

    goal.isActive = false;

    goal.status =
        "cancelled";

    await goal.save();

    res.status(200).json({

        success: true,

        message:
            "Financial goal deleted successfully"
    });
};

// ==========================================
// GET GOAL SUMMARY
// ==========================================

export const getFinancialGoalSummary = async (
    req,
    res
) => {

    const userId = req.user.id;

    const goals =
        await FinancialGoal.find({
            user: userId,
            isActive: true
        });

    let totalGoals = 0;

    let activeGoals = 0;

    let completedGoals = 0;

    let pausedGoals = 0;

    let totalTargetAmount = 0;

    let totalSavedAmount = 0;

    goals.forEach((goal) => {

        totalGoals++;

        totalTargetAmount +=
            Number(goal.targetAmount) || 0;

        totalSavedAmount +=
            Number(goal.currentAmount) || 0;

        if (
            goal.status === "active"
        ) {

            activeGoals++;

        }

        else if (
            goal.status === "completed"
        ) {

            completedGoals++;

        }

        else if (
            goal.status === "paused"
        ) {

            pausedGoals++;
        }
    });

    const remainingAmount =
        Math.max(
            totalTargetAmount -
            totalSavedAmount,
            0
        );

    const overallProgress =
        totalTargetAmount > 0
            ? (
                totalSavedAmount /
                totalTargetAmount
            ) * 100
            : 0;

    res.status(200).json({

        success: true,

        data: {

            totalGoals,

            activeGoals,

            completedGoals,

            pausedGoals,

            totalTargetAmount,

            totalSavedAmount,

            remainingAmount,

            overallProgress:
                Math.min(
                    overallProgress,
                    100
                )
        }
    });
};