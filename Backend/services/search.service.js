import mongoose from "mongoose";

import Transaction from "../models/transaction.model.js";
import Account from "../models/account.model.js";
import Investment from "../models/investment.model.js";
import Budget from "../models/budget.model.js";
import FinancialGoal from "../models/financialGoal.model.js";
import RecurringTransaction from "../models/recurringTransaction.model.js";


const escapeRegex = (value = "") => {
    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
};


const getDateRange = (
    startDate,
    endDate
) => {

    const filter = {};

    if (startDate || endDate) {

        filter.$gte = startDate
            ? new Date(`${startDate}T00:00:00`)
            : new Date(0);

        filter.$lte = endDate
            ? new Date(`${endDate}T23:59:59.999`)
            : new Date();
    }

    return filter;
};


const getAmountFilter = (
    minAmount,
    maxAmount
) => {

    const filter = {};

    if (minAmount !== undefined) {
        filter.$gte = Number(minAmount);
    }

    if (maxAmount !== undefined) {
        filter.$lte = Number(maxAmount);
    }

    return filter;
};


/*
|--------------------------------------------------------------------------
| Transaction Search
|--------------------------------------------------------------------------
*/

const searchTransactions = async (
    userId,
    query
) => {

    const {
        q,
        category,
        transactionType,
        accountId,
        minAmount,
        maxAmount,
        startDate,
        endDate,
        page,
        limit,
        sortOrder,
    } = query;


    const filter = {
        user: userId,
        isActive: true,
    };


    if (q) {

        const regex =
            new RegExp(
                escapeRegex(q),
                "i"
            );

        filter.$or = [
            {
                description: regex,
            },
            {
                merchant: regex,
            },
            {
                category: regex,
            },
        ];
    }


    if (category) {
        filter.category =
            category.toLowerCase();
    }


    if (transactionType) {
        filter.type =
            transactionType;
    }


    if (accountId) {

        if (
            !mongoose.Types.ObjectId.isValid(
                accountId
            )
        ) {
            return {
                data: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                },
            };
        }

        filter.account =
            new mongoose.Types.ObjectId(
                accountId
            );
    }


    if (
        minAmount !== undefined ||
        maxAmount !== undefined
    ) {

        filter.amount =
            getAmountFilter(
                minAmount,
                maxAmount
            );
    }


    if (startDate || endDate) {

        filter.date =
            getDateRange(
                startDate,
                endDate
            );
    }


    const skip =
        (page - 1) * limit;


    const sort =
        sortOrder === "asc"
            ? 1
            : -1;


    const [
        transactions,
        total
    ] = await Promise.all([

        Transaction.find(filter)
            .populate(
                "account",
                "accountName institutionName accountType"
            )
            .sort({
                date: sort,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Transaction.countDocuments(filter),
    ]);


    return {

        data: transactions,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),
        },
    };
};


/*
|--------------------------------------------------------------------------
| Account Search
|--------------------------------------------------------------------------
*/

const searchAccounts = async (
    userId,
    query
) => {

    const {
        q,
        accountType,
        minAmount,
        maxAmount,
        page,
        limit,
        sortOrder,
    } = query;


    const filter = {
        user: userId,
        isActive: true,
    };


    if (q) {

        const regex =
            new RegExp(
                escapeRegex(q),
                "i"
            );

        filter.$or = [
            {
                accountName: regex,
            },
            {
                institutionName: regex,
            },
        ];
    }


    if (accountType) {
        filter.accountType =
            accountType;
    }


    if (
        minAmount !== undefined ||
        maxAmount !== undefined
    ) {

        filter.balance =
            getAmountFilter(
                minAmount,
                maxAmount
            );
    }


    const skip =
        (page - 1) * limit;


    const sort =
        sortOrder === "asc"
            ? 1
            : -1;


    const [
        accounts,
        total
    ] = await Promise.all([

        Account.find(filter)
            .select(
                "-accountNumber -plaidAccountId"
            )
            .sort({
                balance: sort,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Account.countDocuments(filter),
    ]);


    return {

        data: accounts,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),
        },
    };
};


/*
|--------------------------------------------------------------------------
| Investment Search
|--------------------------------------------------------------------------
*/

const searchInvestments = async (
    userId,
    query
) => {

    const {
        q,
        investmentType,
        minAmount,
        maxAmount,
        page,
        limit,
        sortOrder,
    } = query;


    const filter = {
        user: userId,
        isActive: true,
    };


    if (q) {

        const regex =
            new RegExp(
                escapeRegex(q),
                "i"
            );

        filter.$or = [
            {
                name: regex,
            },
            {
                symbol: regex,
            },
            {
                broker: regex,
            },
        ];
    }


    if (investmentType) {
        filter.investmentType =
            investmentType;
    }


    const skip =
        (page - 1) * limit;


    const sort =
        sortOrder === "asc"
            ? 1
            : -1;


    const [
        investments,
        total
    ] = await Promise.all([

        Investment.find(filter)
            .sort({
                currentPrice: sort,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Investment.countDocuments(filter),
    ]);


    const data =
        investments.map(
            (investment) => {

                const investedAmount =
                    Number(
                        investment.quantity
                    ) *
                    Number(
                        investment.buyPrice
                    );


                const currentValue =
                    Number(
                        investment.quantity
                    ) *
                    Number(
                        investment.currentPrice
                    );


                const profitLoss =
                    currentValue -
                    investedAmount;


                return {

                    ...investment,

                    investedAmount,

                    currentValue,

                    profitLoss,

                    returnPercentage:
                        investedAmount > 0
                            ? (
                                profitLoss /
                                investedAmount
                            ) * 100
                            : 0,
                };
            }
        );


    return {

        data,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),
        },
    };
};


/*
|--------------------------------------------------------------------------
| Budget Search
|--------------------------------------------------------------------------
*/

const searchBudgets = async (
    userId,
    query
) => {

    const {
        q,
        category,
        minAmount,
        maxAmount,
        page,
        limit,
        sortOrder,
    } = query;


    const filter = {
        user: userId,
        isActive: true,
    };


    if (q) {

        const regex =
            new RegExp(
                escapeRegex(q),
                "i"
            );

        filter.$or = [
            {
                category: regex,
            },
            {
                description: regex,
            },
        ];
    }


    if (category) {
        filter.category =
            category.toLowerCase();
    }


    if (
        minAmount !== undefined ||
        maxAmount !== undefined
    ) {

        filter.amount =
            getAmountFilter(
                minAmount,
                maxAmount
            );
    }


    const skip =
        (page - 1) * limit;


    const sort =
        sortOrder === "asc"
            ? 1
            : -1;


    const [
        budgets,
        total
    ] = await Promise.all([

        Budget.find(filter)
            .sort({
                amount: sort,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        Budget.countDocuments(filter),
    ]);


    return {

        data: budgets,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),
        },
    };
};


/*
|--------------------------------------------------------------------------
| Financial Goal Search
|--------------------------------------------------------------------------
*/

const searchGoals = async (
    userId,
    query
) => {

    const {
        q,
        category,
        status,
        minAmount,
        maxAmount,
        page,
        limit,
        sortOrder,
    } = query;


    const filter = {
        user: userId,
        isActive: true,
    };


    if (q) {

        const regex =
            new RegExp(
                escapeRegex(q),
                "i"
            );

        filter.$or = [
            {
                name: regex,
            },
            {
                description: regex,
            },
            {
                category: regex,
            },
        ];
    }


    if (category) {
        filter.category =
            category.toLowerCase();
    }


    if (status) {
        filter.status =
            status;
    }


    if (
        minAmount !== undefined ||
        maxAmount !== undefined
    ) {

        filter.targetAmount =
            getAmountFilter(
                minAmount,
                maxAmount
            );
    }


    const skip =
        (page - 1) * limit;


    const sort =
        sortOrder === "asc"
            ? 1
            : -1;


    const [
        goals,
        total
    ] = await Promise.all([

        FinancialGoal.find(filter)
            .sort({
                targetAmount: sort,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        FinancialGoal.countDocuments(filter),
    ]);


    return {

        data: goals,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),
        },
    };
};


/*
|--------------------------------------------------------------------------
| Recurring Transaction Search
|--------------------------------------------------------------------------
*/

const searchRecurringTransactions = async (
    userId,
    query
) => {

    const {
        q,
        category,
        status,
        transactionType,
        minAmount,
        maxAmount,
        page,
        limit,
        sortOrder,
    } = query;


    const filter = {
        user: userId,
    };


    if (q) {

        const regex =
            new RegExp(
                escapeRegex(q),
                "i"
            );

        filter.$or = [
            {
                name: regex,
            },
            {
                description: regex,
            },
            {
                category: regex,
            },
        ];
    }


    if (category) {
        filter.category =
            category.toLowerCase();
    }


    if (status) {
        filter.status =
            status;
    }


    if (transactionType) {
        filter.type =
            transactionType;
    }


    if (
        minAmount !== undefined ||
        maxAmount !== undefined
    ) {

        filter.amount =
            getAmountFilter(
                minAmount,
                maxAmount
            );
    }


    const skip =
        (page - 1) * limit;


    const sort =
        sortOrder === "asc"
            ? 1
            : -1;


    const [
        recurringTransactions,
        total
    ] = await Promise.all([

        RecurringTransaction.find(filter)
            .populate(
                "account",
                "accountName institutionName accountType"
            )
            .sort({
                amount: sort,
            })
            .skip(skip)
            .limit(limit)
            .lean(),

        RecurringTransaction.countDocuments(
            filter
        ),
    ]);


    return {

        data: recurringTransactions,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                ),
        },
    };
};


/*
|--------------------------------------------------------------------------
| Unified Search
|--------------------------------------------------------------------------
*/

export const searchAll = async (
    userId,
    query
) => {

    const {
        type = "all",
        page = 1,
        limit = 20,
    } = query;


    if (type === "transaction") {
        return {
            type,
            ...(await searchTransactions(
                userId,
                query
            )),
        };
    }


    if (type === "account") {
        return {
            type,
            ...(await searchAccounts(
                userId,
                query
            )),
        };
    }


    if (type === "investment") {
        return {
            type,
            ...(await searchInvestments(
                userId,
                query
            )),
        };
    }


    if (type === "budget") {
        return {
            type,
            ...(await searchBudgets(
                userId,
                query
            )),
        };
    }


    if (type === "goal") {
        return {
            type,
            ...(await searchGoals(
                userId,
                query
            )),
        };
    }


    if (type === "recurring") {
        return {
            type,
            ...(await searchRecurringTransactions(
                userId,
                query
            )),
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Search everything
    |--------------------------------------------------------------------------
    */

    const [
        transactions,
        accounts,
        investments,
        budgets,
        goals,
        recurring
    ] = await Promise.all([

        searchTransactions(
            userId,
            query
        ),

        searchAccounts(
            userId,
            query
        ),

        searchInvestments(
            userId,
            query
        ),

        searchBudgets(
            userId,
            query
        ),

        searchGoals(
            userId,
            query
        ),

        searchRecurringTransactions(
            userId,
            query
        ),
    ]);


    return {

        type: "all",

        data: {

            transactions:
                transactions.data,

            accounts:
                accounts.data,

            investments:
                investments.data,

            budgets:
                budgets.data,

            goals:
                goals.data,

            recurringTransactions:
                recurring.data,
        },

        counts: {

            transactions:
                transactions.pagination.total,

            accounts:
                accounts.pagination.total,

            investments:
                investments.pagination.total,

            budgets:
                budgets.pagination.total,

            goals:
                goals.pagination.total,

            recurringTransactions:
                recurring.pagination.total,
        },

        pagination: {
            page,
            limit,
        },
    };
};