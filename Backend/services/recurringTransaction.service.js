import RecurringTransaction from "../models/recurringTransaction.model.js";
import Transaction from "../models/transaction.model.js";
import Account from "../models/account.model.js";


// ==========================================
// GET NEXT RUN DATE
// ==========================================

export const getNextRunDate = (
    currentDate,
    frequency
) => {

    const nextDate =
        new Date(currentDate);

    switch (frequency) {

        case "daily":

            nextDate.setDate(
                nextDate.getDate() + 1
            );

            break;

        case "weekly":

            nextDate.setDate(
                nextDate.getDate() + 7
            );

            break;

        case "monthly": {

            const originalDay =
                nextDate.getDate();

            nextDate.setDate(1);

            nextDate.setMonth(
                nextDate.getMonth() + 1
            );

            const lastDayOfMonth =
                new Date(
                    nextDate.getFullYear(),
                    nextDate.getMonth() + 1,
                    0
                ).getDate();

            nextDate.setDate(
                Math.min(
                    originalDay,
                    lastDayOfMonth
                )
            );

            break;
        }

        case "yearly": {

            const originalMonth =
                nextDate.getMonth();

            const originalDay =
                nextDate.getDate();

            nextDate.setDate(1);

            nextDate.setFullYear(
                nextDate.getFullYear() + 1
            );

            nextDate.setMonth(
                originalMonth
            );

            const lastDayOfMonth =
                new Date(
                    nextDate.getFullYear(),
                    originalMonth + 1,
                    0
                ).getDate();

            nextDate.setDate(
                Math.min(
                    originalDay,
                    lastDayOfMonth
                )
            );

            break;
        }

        default:
            throw new Error(
                "Invalid recurring frequency."
            );
    }

    return nextDate;
};


// ==========================================
// MOVE DATE INTO FUTURE
// ==========================================

export const getNextFutureRunDate = (
    date,
    frequency
) => {

    let nextDate =
        new Date(date);

    const now =
        new Date();

    let safetyCounter = 0;

    while (
        nextDate <= now &&
        safetyCounter < 1000
    ) {

        nextDate =
            getNextRunDate(
                nextDate,
                frequency
            );

        safetyCounter++;
    }

    return nextDate;
};


// ==========================================
// PROCESS SINGLE RECURRING TRANSACTION
// ==========================================

export const processRecurringTransaction =
    async (recurringTransaction) => {

        const account =
            await Account.findOne({
                _id: recurringTransaction.account,
                user: recurringTransaction.user,
                isActive: true
            });

        if (!account) {

            recurringTransaction.status =
                "paused";

            await recurringTransaction.save();

            throw new Error(
                `Account unavailable for recurring transaction ${recurringTransaction._id}`
            );
        }

        const transactionDate =
            new Date(
                recurringTransaction.nextRunDate
            );

        // ------------------------------------------
        // CREATE NORMAL TRANSACTION
        // ------------------------------------------

        const transaction =
            await Transaction.create({
                user: recurringTransaction.user,

                account:
                    recurringTransaction.account,

                type:
                    recurringTransaction.type,

                amount:
                    recurringTransaction.amount,

                category:
                    recurringTransaction.category,

                description:
                    recurringTransaction.description ||
                    recurringTransaction.name,

                date:
                    transactionDate,

                source: "manual"
            });

        // ------------------------------------------
        // UPDATE ACCOUNT BALANCE
        // ------------------------------------------

        if (
            recurringTransaction.type ===
            "income"
        ) {

            account.balance +=
                recurringTransaction.amount;

        } else {

            account.balance -=
                recurringTransaction.amount;
        }

        await account.save();

        // ------------------------------------------
        // UPDATE RECURRING TRANSACTION
        // ------------------------------------------

        recurringTransaction.lastRunDate =
            transactionDate;

        const nextRunDate =
            getNextRunDate(
                transactionDate,
                recurringTransaction.frequency
            );

        // ------------------------------------------
        // END DATE CHECK
        // ------------------------------------------

        if (
            recurringTransaction.endDate &&
            nextRunDate >
                recurringTransaction.endDate
        ) {

            recurringTransaction.status =
                "completed";

            recurringTransaction.isActive =
                false;

        } else {

            recurringTransaction.nextRunDate =
                nextRunDate;
        }

        await recurringTransaction.save();

        return transaction;
    };


// ==========================================
// PROCESS ALL DUE TRANSACTIONS
// ==========================================

export const processDueRecurringTransactions =
    async () => {

        const now =
            new Date();

        const dueTransactions =
            await RecurringTransaction.find({
                status: "active",
                isActive: true,
                nextRunDate: {
                    $lte: now
                }
            });

        let processed = 0;
        let failed = 0;

        for (
            const recurringTransaction
            of dueTransactions
        ) {

            try {

                // ----------------------------------
                // Catch up missed occurrences
                // ----------------------------------

                let safetyCounter = 0;

                while (
                    recurringTransaction.status ===
                        "active" &&
                    recurringTransaction.nextRunDate <=
                        now &&
                    safetyCounter < 100
                ) {

                    await processRecurringTransaction(
                        recurringTransaction
                    );

                    processed++;

                    safetyCounter++;
                }

            } catch (error) {

                failed++;

                console.error(
                    "Recurring transaction processing error:",
                    error.message
                );
            }
        }

        return {
            processed,
            failed
        };
    };