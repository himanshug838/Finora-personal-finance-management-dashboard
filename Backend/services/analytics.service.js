import mongoose from "mongoose";

import Transaction from "../models/transaction.model.js";
import Account from "../models/account.model.js";
import Budget from "../models/budget.model.js";
import Investment from "../models/investment.model.js";
import NetWorthSnapshot from "../models/netWorthSnapshot.model.js";


/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

const DEFAULT_TIMEZONE =
    process.env.APP_TIMEZONE || "Asia/Kolkata";


const getStartOfDay = (date) => {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
};


const getEndOfDay = (date) => {
    const result = new Date(date);

    result.setHours(23, 59, 59, 999);

    return result;
};


const getCurrentMonthRange = () => {
    const now = new Date();

    const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
    );

    return {
        startDate: getStartOfDay(startDate),
        endDate: getEndOfDay(endDate)
    };
};


const getDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) {
        return getCurrentMonthRange();
    }

    const start = startDate
        ? getStartOfDay(new Date(startDate))
        : new Date(0);

    const end = endDate
        ? getEndOfDay(new Date(endDate))
        : new Date();

    return {
        startDate: start,
        endDate: end
    };
};


const round = (number) => {
    return Number((Number(number) || 0).toFixed(2));
};


const getPercentage = (value, total) => {
    if (!total) return 0;

    return round((value / total) * 100);
};


/*
|--------------------------------------------------------------------------
| 1. OVERVIEW
|--------------------------------------------------------------------------
*/

export const getAnalyticsOverview = async (
    userId,
    startDate,
    endDate
) => {

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const range = getDateRange(
        startDate,
        endDate
    );

    const [
        transactionStats,
        accountStats,
        investmentStats,
        budgetStats
    ] = await Promise.all([

        /*
        |--------------------------------------------------------------------------
        | Transaction statistics
        |--------------------------------------------------------------------------
        */

        Transaction.aggregate([
            {
                $match: {
                    user: userObjectId,
                    isActive: true,
                    date: {
                        $gte: range.startDate,
                        $lte: range.endDate
                    }
                }
            },

            {
                $group: {
                    _id: "$type",

                    total: {
                        $sum: "$amount"
                    },

                    count: {
                        $sum: 1
                    }
                }
            }
        ]),


        /*
        |--------------------------------------------------------------------------
        | Account statistics
        |--------------------------------------------------------------------------
        */

        Account.aggregate([
            {
                $match: {
                    user: userObjectId,
                    isActive: true
                }
            },

            {
                $group: {
                    _id: "$accountType",

                    balance: {
                        $sum: "$balance"
                    },

                    count: {
                        $sum: 1
                    }
                }
            }
        ]),


        /*
        |--------------------------------------------------------------------------
        | Investment statistics
        |--------------------------------------------------------------------------
        */

        Investment.aggregate([
            {
                $match: {
                    user: userObjectId,
                    isActive: true
                }
            },

            {
                $project: {
                    investedAmount: {
                        $multiply: [
                            "$quantity",
                            "$buyPrice"
                        ]
                    },

                    currentValue: {
                        $multiply: [
                            "$quantity",
                            "$currentPrice"
                        ]
                    }
                }
            },

            {
                $group: {
                    _id: null,

                    investedAmount: {
                        $sum: "$investedAmount"
                    },

                    currentValue: {
                        $sum: "$currentValue"
                    },

                    count: {
                        $sum: 1
                    }
                }
            }
        ]),


        /*
        |--------------------------------------------------------------------------
        | Budget statistics
        |--------------------------------------------------------------------------
        */

        Budget.aggregate([
            {
                $match: {
                    user: userObjectId,
                    isActive: true
                }
            },

            {
                $group: {
                    _id: null,

                    totalBudget: {
                        $sum: "$amount"
                    },

                    count: {
                        $sum: 1
                    }
                }
            }
        ])
    ]);


    let totalIncome = 0;
    let totalExpense = 0;

    let incomeCount = 0;
    let expenseCount = 0;

    transactionStats.forEach((item) => {

        if (item._id === "income") {
            totalIncome = item.total;
            incomeCount = item.count;
        }

        if (item._id === "expense") {
            totalExpense = item.total;
            expenseCount = item.count;
        }
    });


    let bankBalance = 0;
    let cashBalance = 0;
    let creditCardBalance = 0;
    let loanBalance = 0;


    accountStats.forEach((account) => {

        const balance =
            Number(account.balance) || 0;

        switch (account._id) {

            case "bank":
                bankBalance += balance;
                break;

            case "cash":
                cashBalance += balance;
                break;

            case "credit_card":
                creditCardBalance += Math.abs(balance);
                break;

            case "loan":
                loanBalance += Math.abs(balance);
                break;

            default:
                break;
        }
    });


    const investedAmount =
        investmentStats[0]?.investedAmount || 0;

    const investmentValue =
        investmentStats[0]?.currentValue || 0;

    const investmentProfitLoss =
        investmentValue - investedAmount;


    const savings =
        totalIncome - totalExpense;


    const savingsRate =
        totalIncome > 0
            ? (savings / totalIncome) * 100
            : 0;


    const totalAssets =
        bankBalance +
        cashBalance +
        investmentValue;


    const totalLiabilities =
        creditCardBalance +
        loanBalance;


    const netWorth =
        totalAssets - totalLiabilities;


    return {
        period: {
            startDate: range.startDate,
            endDate: range.endDate
        },

        income: {
            total: round(totalIncome),
            transactionCount: incomeCount
        },

        expenses: {
            total: round(totalExpense),
            transactionCount: expenseCount
        },

        savings: {
            amount: round(savings),
            rate: round(savingsRate)
        },

        accounts: {
            bankBalance: round(bankBalance),
            cashBalance: round(cashBalance),
            creditCardBalance: round(creditCardBalance),
            loanBalance: round(loanBalance)
        },

        investments: {
            investedAmount: round(investedAmount),
            currentValue: round(investmentValue),
            profitLoss: round(investmentProfitLoss),
            returnPercentage:
                investedAmount > 0
                    ? round(
                        (investmentProfitLoss /
                            investedAmount) *
                        100
                    )
                    : 0
        },

        netWorth: {
            assets: round(totalAssets),
            liabilities: round(totalLiabilities),
            value: round(netWorth)
        },

        budgets: {
            totalBudget:
                round(budgetStats[0]?.totalBudget || 0),

            activeBudgets:
                budgetStats[0]?.count || 0
        }
    };
};


/*
|--------------------------------------------------------------------------
| 2. INCOME VS EXPENSE
|--------------------------------------------------------------------------
*/

export const getIncomeExpenseAnalytics = async (
    userId,
    startDate,
    endDate
) => {

    const userObjectId =
        new mongoose.Types.ObjectId(userId);

    const range = getDateRange(
        startDate,
        endDate
    );

    const result = await Transaction.aggregate([

        {
            $match: {
                user: userObjectId,
                isActive: true,

                type: {
                    $in: ["income", "expense"]
                },

                date: {
                    $gte: range.startDate,
                    $lte: range.endDate
                }
            }
        },

        {
            $group: {
                _id: "$type",

                total: {
                    $sum: "$amount"
                },

                count: {
                    $sum: 1
                }
            }
        }
    ]);


    let income = 0;
    let expense = 0;

    let incomeCount = 0;
    let expenseCount = 0;


    result.forEach((item) => {

        if (item._id === "income") {
            income = item.total;
            incomeCount = item.count;
        }

        if (item._id === "expense") {
            expense = item.total;
            expenseCount = item.count;
        }
    });


    const savings =
        income - expense;


    return {
        period: {
            startDate: range.startDate,
            endDate: range.endDate
        },

        income: {
            amount: round(income),
            count: incomeCount
        },

        expense: {
            amount: round(expense),
            count: expenseCount
        },

        savings: {
            amount: round(savings),

            rate:
                income > 0
                    ? round((savings / income) * 100)
                    : 0
        }
    };
};


/*
|--------------------------------------------------------------------------
| 3. SPENDING ANALYTICS
|--------------------------------------------------------------------------
*/

export const getSpendingAnalytics = async (
    userId,
    startDate,
    endDate
) => {

    const userObjectId =
        new mongoose.Types.ObjectId(userId);

    const range = getDateRange(
        startDate,
        endDate
    );


    const categories = await Transaction.aggregate([

        {
            $match: {
                user: userObjectId,
                isActive: true,
                type: "expense",

                date: {
                    $gte: range.startDate,
                    $lte: range.endDate
                }
            }
        },

        {
            $group: {
                _id: "$category",

                amount: {
                    $sum: "$amount"
                },

                transactionCount: {
                    $sum: 1
                }
            }
        },

        {
            $sort: {
                amount: -1
            }
        }
    ]);


    const totalExpense =
        categories.reduce(
            (sum, item) =>
                sum + item.amount,
            0
        );


    const formattedCategories =
        categories.map((item) => ({

            category: item._id,

            amount: round(item.amount),

            percentage:
                getPercentage(
                    item.amount,
                    totalExpense
                ),

            transactionCount:
                item.transactionCount
        }));


    const topCategory =
        formattedCategories[0] || null;


    return {
        period: {
            startDate: range.startDate,
            endDate: range.endDate
        },

        totalExpense:
            round(totalExpense),

        averageTransaction:
            categories.length > 0
                ? round(
                    totalExpense /
                    categories.reduce(
                        (sum, item) =>
                            sum + item.transactionCount,
                        0
                    )
                )
                : 0,

        topCategory,

        categories:
            formattedCategories
    };
};


/*
|--------------------------------------------------------------------------
| 4. MONTHLY TRENDS
|--------------------------------------------------------------------------
*/

export const getMonthlyTrends = async (
    userId,
    months = 6
) => {

    const userObjectId =
        new mongoose.Types.ObjectId(userId);

    months = Math.min(
        Math.max(Number(months) || 6, 1),
        24
    );


    const endDate = new Date();

    const startDate = new Date();

    startDate.setMonth(
        startDate.getMonth() - (months - 1)
    );

    startDate.setDate(1);

    startDate.setHours(
        0,
        0,
        0,
        0
    );


    const result = await Transaction.aggregate([

        {
            $match: {
                user: userObjectId,
                isActive: true,

                type: {
                    $in: ["income", "expense"]
                },

                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },

        {
            $group: {

                _id: {
                    year: {
                        $year: {
                            date: "$date",
                            timezone: DEFAULT_TIMEZONE
                        }
                    },

                    month: {
                        $month: {
                            date: "$date",
                            timezone: DEFAULT_TIMEZONE
                        }
                    }
                },

                income: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$type",
                                    "income"
                                ]
                            },
                            "$amount",
                            0
                        ]
                    }
                },

                expense: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$type",
                                    "expense"
                                ]
                            },
                            "$amount",
                            0
                        ]
                    }
                },

                incomeCount: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$type",
                                    "income"
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },

                expenseCount: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$type",
                                    "expense"
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },

        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);


    const formattedData =
        result.map((item) => {

            const savings =
                item.income -
                item.expense;

            return {
                year: item._id.year,
                month: item._id.month,

                monthLabel:
                    new Date(
                        item._id.year,
                        item._id.month - 1,
                        1
                    ).toLocaleDateString(
                        "en-IN",
                        {
                            month: "short",
                            year: "numeric"
                        }
                    ),

                income:
                    round(item.income),

                expense:
                    round(item.expense),

                savings:
                    round(savings),

                savingsRate:
                    item.income > 0
                        ? round(
                            (savings /
                                item.income) *
                            100
                        )
                        : 0,

                incomeCount:
                    item.incomeCount,

                expenseCount:
                    item.expenseCount
            };
        });


    return {
        months,

        startDate,

        endDate,

        data: formattedData
    };
};


/*
|--------------------------------------------------------------------------
| 5. BUDGET PERFORMANCE
|--------------------------------------------------------------------------
*/

export const getBudgetPerformance = async (
    userId
) => {

    const userObjectId =
        new mongoose.Types.ObjectId(userId);


    const budgets = await Budget.find({
        user: userObjectId,
        isActive: true
    }).lean();


    if (!budgets.length) {
        return {
            totalBudget: 0,
            totalSpent: 0,
            remaining: 0,
            percentageUsed: 0,
            exceededBudgets: 0,
            budgets: []
        };
    }


    const performance =
        await Promise.all(

            budgets.map(async (budget) => {

                const startDate =
                    getStartOfDay(
                        budget.startDate
                    );


                const endDate =
                    budget.endDate
                        ? getEndOfDay(
                            budget.endDate
                        )
                        : new Date();


                const expenseResult =
                    await Transaction.aggregate([

                        {
                            $match: {
                                user: userObjectId,

                                isActive: true,

                                type: "expense",

                                category:
                                    budget.category,

                                date: {
                                    $gte: startDate,
                                    $lte: endDate
                                }
                            }
                        },

                        {
                            $group: {
                                _id: null,

                                spent: {
                                    $sum: "$amount"
                                },

                                transactionCount: {
                                    $sum: 1
                                }
                            }
                        }
                    ]);


                const spent =
                    expenseResult[0]?.spent || 0;


                const remaining =
                    budget.amount - spent;


                const percentageUsed =
                    budget.amount > 0
                        ? (spent /
                            budget.amount) *
                        100
                        : 0;


                return {

                    id: budget._id,

                    category:
                        budget.category,

                    period:
                        budget.period,

                    amount:
                        round(budget.amount),

                    spent:
                        round(spent),

                    remaining:
                        round(remaining),

                    percentageUsed:
                        round(percentageUsed),

                    isExceeded:
                        spent >
                        budget.amount,

                    transactionCount:
                        expenseResult[0]
                            ?.transactionCount || 0,

                    startDate:
                        budget.startDate,

                    endDate:
                        budget.endDate
                };
            })
        );


    const totalBudget =
        performance.reduce(
            (sum, budget) =>
                sum + budget.amount,
            0
        );


    const totalSpent =
        performance.reduce(
            (sum, budget) =>
                sum + budget.spent,
            0
        );


    const exceededBudgets =
        performance.filter(
            (budget) =>
                budget.isExceeded
        ).length;


    return {

        totalBudget:
            round(totalBudget),

        totalSpent:
            round(totalSpent),

        remaining:
            round(
                totalBudget -
                totalSpent
            ),

        percentageUsed:
            totalBudget > 0
                ? round(
                    (totalSpent /
                        totalBudget) *
                    100
                )
                : 0,

        exceededBudgets,

        budgets:
            performance
    };
};


/*
|--------------------------------------------------------------------------
| 6. INVESTMENT ANALYTICS
|--------------------------------------------------------------------------
*/

export const getInvestmentAnalytics = async (
    userId
) => {

    const userObjectId =
        new mongoose.Types.ObjectId(userId);


    const investments =
        await Investment.find({
            user: userObjectId,
            isActive: true
        }).lean();


    let investedAmount = 0;
    let currentValue = 0;


    const investmentList =
        investments.map((investment) => {

            const invested =
                Number(
                    investment.quantity
                ) *
                Number(
                    investment.buyPrice
                );


            const current =
                Number(
                    investment.quantity
                ) *
                Number(
                    investment.currentPrice
                );


            const profitLoss =
                current - invested;


            const returnPercentage =
                invested > 0
                    ? (profitLoss /
                        invested) *
                    100
                    : 0;


            investedAmount += invested;
            currentValue += current;


            return {

                id:
                    investment._id,

                name:
                    investment.name,

                symbol:
                    investment.symbol,

                investmentType:
                    investment.investmentType,

                quantity:
                    Number(
                        investment.quantity
                    ),

                buyPrice:
                    round(
                        investment.buyPrice
                    ),

                currentPrice:
                    round(
                        investment.currentPrice
                    ),

                investedAmount:
                    round(invested),

                currentValue:
                    round(current),

                profitLoss:
                    round(profitLoss),

                returnPercentage:
                    round(
                        returnPercentage
                    ),

                purchaseDate:
                    investment.purchaseDate,

                broker:
                    investment.broker || ""
            };
        });


    const profitLoss =
        currentValue -
        investedAmount;


    return {

        summary: {

            investedAmount:
                round(investedAmount),

            currentValue:
                round(currentValue),

            profitLoss:
                round(profitLoss),

            returnPercentage:
                investedAmount > 0
                    ? round(
                        (profitLoss /
                            investedAmount) *
                        100
                    )
                    : 0,

            investmentCount:
                investments.length
        },

        investments:
            investmentList
    };
};


/*
|--------------------------------------------------------------------------
| 7. NET WORTH ANALYTICS
|--------------------------------------------------------------------------
*/

export const getNetWorthAnalytics = async (
    userId,
    months = 6
) => {

    const userObjectId =
        new mongoose.Types.ObjectId(userId);


    months = Math.min(
        Math.max(Number(months) || 6, 1),
        24
    );


    const startDate =
        new Date();

    startDate.setMonth(
        startDate.getMonth() -
        months
    );


    const snapshots =
        await NetWorthSnapshot.find({
            user: userObjectId,

            snapshotDate: {
                $gte: startDate
            }
        })
            .sort({
                snapshotDate: 1
            })
            .select(
                "snapshotDate totalAssets totalLiabilities netWorth bankBalance cashBalance investmentValue creditCardBalance loanBalance currency"
            )
            .lean();


    const data =
        snapshots.map((snapshot) => ({
            date:
                snapshot.snapshotDate,

            totalAssets:
                round(
                    snapshot.totalAssets
                ),

            totalLiabilities:
                round(
                    snapshot.totalLiabilities
                ),

            netWorth:
                round(
                    snapshot.netWorth
                ),

            bankBalance:
                round(
                    snapshot.bankBalance
                ),

            cashBalance:
                round(
                    snapshot.cashBalance
                ),

            investmentValue:
                round(
                    snapshot.investmentValue
                ),

            creditCardBalance:
                round(
                    snapshot.creditCardBalance
                ),

            loanBalance:
                round(
                    snapshot.loanBalance
                ),

            currency:
                snapshot.currency
        }));


    let change = 0;
    let changePercentage = 0;


    if (data.length >= 2) {

        const first =
            data[0].netWorth;

        const latest =
            data[data.length - 1]
                .netWorth;


        change =
            latest - first;


        changePercentage =
            first !== 0
                ? (change /
                    Math.abs(first)) *
                100
                : 0;
    }


    return {

        months,

        summary: {

            startingNetWorth:
                data.length
                    ? data[0].netWorth
                    : 0,

            currentNetWorth:
                data.length
                    ? data[data.length - 1]
                        .netWorth
                    : 0,

            change:
                round(change),

            changePercentage:
                round(
                    changePercentage
                )
        },

        data
    };
};


/*
|--------------------------------------------------------------------------
| 8. COMPLETE FINANCIAL REPORT
|--------------------------------------------------------------------------
*/

export const getFinancialReport = async (
    userId,
    startDate,
    endDate
) => {

    const range =
        getDateRange(
            startDate,
            endDate
        );


    const [
        overview,
        incomeExpense,
        spending,
        budgetPerformance,
        investments,
        netWorth
    ] = await Promise.all([

        getAnalyticsOverview(
            userId,
            range.startDate,
            range.endDate
        ),

        getIncomeExpenseAnalytics(
            userId,
            range.startDate,
            range.endDate
        ),

        getSpendingAnalytics(
            userId,
            range.startDate,
            range.endDate
        ),

        getBudgetPerformance(
            userId
        ),

        getInvestmentAnalytics(
            userId
        ),

        getNetWorthAnalytics(
            userId,
            6
        )
    ]);


    return {

        generatedAt:
            new Date(),

        period: {
            startDate:
                range.startDate,

            endDate:
                range.endDate
        },

        overview,

        incomeExpense,

        spending,

        budgetPerformance,

        investments,

        netWorth
    };
};