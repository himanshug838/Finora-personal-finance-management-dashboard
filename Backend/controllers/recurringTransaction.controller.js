import mongoose from "mongoose";

import RecurringTransaction
    from "../models/recurringTransaction.model.js";

import Account
    from "../models/account.model.js";

import {
    validateRecurringTransaction
} from "../validators/recurringTransaction.validator.js";

import {
    getNextFutureRunDate
} from "../services/recurringTransaction.service.js";


// ==========================================
// CREATE
// ==========================================

export const createRecurringTransaction =
    async (req, res) => {

        const userId =
            req.user.id;

        const validationError =
            validateRecurringTransaction(
                req.body
            );

        if (validationError) {

            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const {
            name,
            description,
            account,
            type,
            amount,
            category,
            currency,
            frequency,
            startDate,
            endDate
        } = req.body;

        // --------------------------------------
        // Validate account ownership
        // --------------------------------------

        const userAccount =
            await Account.findOne({
                _id: account,
                user: userId,
                isActive: true
            });

        if (!userAccount) {

            return res.status(404).json({
                success: false,
                message: "Account not found."
            });
        }

        const parsedStartDate =
            new Date(startDate);

        const parsedEndDate =
            endDate
                ? new Date(endDate)
                : null;

        const nextRunDate =
            getNextFutureRunDate(
                parsedStartDate,
                frequency
            );

        const recurringTransaction =
            await RecurringTransaction.create({

                user: userId,

                account,

                name:
                    name.trim(),

                description:
                    description?.trim() || "",

                type,

                amount:
                    Number(amount),

                category:
                    category?.trim() || "other",

                currency:
                    currency || "INR",

                frequency,

                startDate:
                    parsedStartDate,

                endDate:
                    parsedEndDate,

                nextRunDate,

                status: "active",

                isActive: true
            });

        return res.status(201).json({
            success: true,
            message:
                "Recurring transaction created successfully.",
            data:
                recurringTransaction
        });
    };


// ==========================================
// GET ALL
// ==========================================

export const getRecurringTransactions =
    async (req, res) => {

        const userId =
            req.user.id;

        const {
            status,
            type,
            frequency
        } = req.query;

        const filter = {
            user: userId
        };

        if (status) {
            filter.status = status;
        }

        if (type) {
            filter.type = type;
        }

        if (frequency) {
            filter.frequency =
                frequency;
        }

        const recurringTransactions =
            await RecurringTransaction
                .find(filter)
                .populate(
                    "account",
                    "accountName institutionName accountType currency"
                )
                .sort({
                    nextRunDate: 1
                });

        return res.status(200).json({
            success: true,
            count:
                recurringTransactions.length,
            data:
                recurringTransactions
        });
    };


// ==========================================
// GET ONE
// ==========================================

export const getRecurringTransaction =
    async (req, res) => {

        const {
            id
        } = req.params;

        if (
            !mongoose.Types.ObjectId
                .isValid(id)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid recurring transaction ID."
            });
        }

        const recurringTransaction =
            await RecurringTransaction
                .findOne({
                    _id: id,
                    user: req.user.id
                })
                .populate(
                    "account",
                    "accountName institutionName accountType currency balance"
                );

        if (!recurringTransaction) {

            return res.status(404).json({
                success: false,
                message:
                    "Recurring transaction not found."
            });
        }

        return res.status(200).json({
            success: true,
            data:
                recurringTransaction
        });
    };


// ==========================================
// UPDATE
// ==========================================

export const updateRecurringTransaction =
    async (req, res) => {

        const {
            id
        } = req.params;

        if (
            !mongoose.Types.ObjectId
                .isValid(id)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid recurring transaction ID."
            });
        }

        const existing =
            await RecurringTransaction.findOne({
                _id: id,
                user: req.user.id
            });

        if (!existing) {

            return res.status(404).json({
                success: false,
                message:
                    "Recurring transaction not found."
            });
        }

        const validationError =
            validateRecurringTransaction({
                ...existing.toObject(),
                ...req.body
            });

        if (validationError) {

            return res.status(400).json({
                success: false,
                message:
                    validationError
            });
        }

        if (req.body.account) {

            const account =
                await Account.findOne({
                    _id: req.body.account,
                    user: req.user.id,
                    isActive: true
                });

            if (!account) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Account not found."
                });
            }
        }

        const scheduleChanged =
            req.body.startDate ||
            req.body.frequency;

        Object.assign(
            existing,
            req.body
        );

        if (req.body.amount !== undefined) {

            existing.amount =
                Number(req.body.amount);
        }

        if (req.body.name) {

            existing.name =
                req.body.name.trim();
        }

        if (req.body.description !== undefined) {

            existing.description =
                req.body.description.trim();
        }

        if (scheduleChanged) {

            const startDate =
                new Date(
                    req.body.startDate ||
                    existing.startDate
                );

            existing.nextRunDate =
                getNextFutureRunDate(
                    startDate,
                    req.body.frequency ||
                    existing.frequency
                );
        }

        await existing.save();

        return res.status(200).json({
            success: true,
            message:
                "Recurring transaction updated successfully.",
            data:
                existing
        });
    };


// ==========================================
// PAUSE
// ==========================================

export const pauseRecurringTransaction =
    async (req, res) => {

        const recurringTransaction =
            await RecurringTransaction.findOne({
                _id: req.params.id,
                user: req.user.id
            });

        if (!recurringTransaction) {

            return res.status(404).json({
                success: false,
                message:
                    "Recurring transaction not found."
            });
        }

        recurringTransaction.status =
            "paused";

        await recurringTransaction.save();

        return res.status(200).json({
            success: true,
            message:
                "Recurring transaction paused.",
            data:
                recurringTransaction
        });
    };


// ==========================================
// RESUME
// ==========================================

export const resumeRecurringTransaction =
    async (req, res) => {

        const recurringTransaction =
            await RecurringTransaction.findOne({
                _id: req.params.id,
                user: req.user.id
            });

        if (!recurringTransaction) {

            return res.status(404).json({
                success: false,
                message:
                    "Recurring transaction not found."
            });
        }

        if (
            recurringTransaction.status ===
            "completed"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Completed recurring transactions cannot be resumed."
            });
        }

        recurringTransaction.status =
            "active";

        recurringTransaction.isActive =
            true;

        if (
            recurringTransaction.nextRunDate <
            new Date()
        ) {

            recurringTransaction.nextRunDate =
                getNextFutureRunDate(
                    recurringTransaction.nextRunDate,
                    recurringTransaction.frequency
                );
        }

        await recurringTransaction.save();

        return res.status(200).json({
            success: true,
            message:
                "Recurring transaction resumed.",
            data:
                recurringTransaction
        });
    };


// ==========================================
// DELETE
// ==========================================

export const deleteRecurringTransaction =
    async (req, res) => {

        const recurringTransaction =
            await RecurringTransaction.findOne({
                _id: req.params.id,
                user: req.user.id
            });

        if (!recurringTransaction) {

            return res.status(404).json({
                success: false,
                message:
                    "Recurring transaction not found."
            });
        }

        recurringTransaction.status =
            "cancelled";

        recurringTransaction.isActive =
            false;

        await recurringTransaction.save();

        return res.status(200).json({
            success: true,
            message:
                "Recurring transaction cancelled successfully."
        });
    };


// ==========================================
// SUMMARY
// ==========================================

export const getRecurringTransactionSummary =
    async (req, res) => {

        const userId =
            req.user.id;

        const transactions =
            await RecurringTransaction.find({
                user: userId,
                isActive: true
            });

        let monthlyIncome = 0;
        let monthlyExpense = 0;

        for (
            const transaction
            of transactions
        ) {

            let multiplier = 0;

            switch (
                transaction.frequency
            ) {

                case "daily":
                    multiplier = 30;
                    break;

                case "weekly":
                    multiplier = 4.33;
                    break;

                case "monthly":
                    multiplier = 1;
                    break;

                case "yearly":
                    multiplier = 1 / 12;
                    break;

                default:
                    multiplier = 0;
            }

            const monthlyAmount =
                transaction.amount *
                multiplier;

            if (
                transaction.type ===
                "income"
            ) {

                monthlyIncome +=
                    monthlyAmount;

            } else {

                monthlyExpense +=
                    monthlyAmount;
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                activeCount:
                    transactions.length,

                monthlyIncome:
                    Number(
                        monthlyIncome.toFixed(2)
                    ),

                monthlyExpense:
                    Number(
                        monthlyExpense.toFixed(2)
                    ),

                monthlyNet:
                    Number(
                        (
                            monthlyIncome -
                            monthlyExpense
                        ).toFixed(2)
                    )
            }
        });
    };