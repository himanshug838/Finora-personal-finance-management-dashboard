import Account from "../models/account.model.js";
import Investment from "../models/investment.model.js";
import NetWorthSnapshot from "../models/netWorthSnapshot.model.js";

// ==========================================
// GET CURRENT NET WORTH
// ==========================================

export const getNetWorth = async (req, res) => {
    const userId = req.user.id;

    const accounts = await Account.find({
        user: userId,
        isActive: true
    }).select("accountType balance currency");

    const investments = await Investment.find({
        user: userId,
        isActive: true
    }).select("quantity currentPrice currency");

    let bankBalance = 0;
    let cashBalance = 0;
    let creditCardBalance = 0;
    let loanBalance = 0;

    // ==========================================
    // ACCOUNT CALCULATION
    // ==========================================

    accounts.forEach((account) => {
        const balance = Number(account.balance) || 0;

        switch (account.accountType) {
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

            case "investment":
                // Prevent double counting
                break;

            default:
                break;
        }
    });

    // ==========================================
    // INVESTMENTS
    // ==========================================

    let investmentValue = 0;

    investments.forEach((investment) => {
        const quantity = Number(investment.quantity) || 0;
        const currentPrice = Number(investment.currentPrice) || 0;

        investmentValue += quantity * currentPrice;
    });

    // ==========================================
    // TOTAL ASSETS
    // ==========================================

    const totalAssets =
        bankBalance +
        cashBalance +
        investmentValue;

    // ==========================================
    // TOTAL LIABILITIES
    // ==========================================

    const totalLiabilities =
        creditCardBalance +
        loanBalance;

    // ==========================================
    // NET WORTH
    // ==========================================

    const netWorth =
        totalAssets -
        totalLiabilities;

    res.status(200).json({
        success: true,
        data: {
            netWorth,
            totalAssets,
            totalLiabilities,
            bankBalance,
            cashBalance,
            investmentValue,
            creditCardBalance,
            loanBalance
        }
    });
};

// ==========================================
// GET NET WORTH BREAKDOWN
// ==========================================

export const getNetWorthBreakdown = async (req, res) => {
    const userId = req.user.id;

    const accounts = await Account.find({
        user: userId,
        isActive: true
    }).select(
        "accountName accountType balance currency institutionName"
    );

    const investments = await Investment.find({
        user: userId,
        isActive: true
    }).select(
        "name symbol quantity currentPrice investmentType currency"
    );

    const breakdown = {
        assets: {
            bank: 0,
            cash: 0,
            investments: 0
        },

        liabilities: {
            creditCards: 0,
            loans: 0
        },

        accounts: [],
        investments: []
    };

    // ==========================================
    // ACCOUNT BREAKDOWN
    // ==========================================

    accounts.forEach((account) => {
        const balance = Number(account.balance) || 0;

        switch (account.accountType) {
            case "bank":
                breakdown.assets.bank += balance;
                break;

            case "cash":
                breakdown.assets.cash += balance;
                break;

            case "credit_card":
                breakdown.liabilities.creditCards +=
                    Math.abs(balance);
                break;

            case "loan":
                breakdown.liabilities.loans +=
                    Math.abs(balance);
                break;

            case "investment":
                // Investment model handles investment valuation
                break;

            default:
                break;
        }
    });

    // ==========================================
    // INVESTMENT BREAKDOWN
    // ==========================================

    investments.forEach((investment) => {
        const quantity =
            Number(investment.quantity) || 0;

        const currentPrice =
            Number(investment.currentPrice) || 0;

        const currentValue =
            quantity * currentPrice;

        breakdown.assets.investments +=
            currentValue;

        breakdown.investments.push({
            name: investment.name,
            symbol: investment.symbol,
            investmentType: investment.investmentType,
            quantity,
            currentPrice,
            currentValue,
            currency: investment.currency
        });
    });

    // ==========================================
    // ACCOUNT DETAILS
    // ==========================================

    breakdown.accounts = accounts.map((account) => ({
        accountName: account.accountName,
        institutionName: account.institutionName,
        accountType: account.accountType,
        balance: account.balance,
        currency: account.currency
    }));

    res.status(200).json({
        success: true,
        data: breakdown
    });
};

// ==========================================
// GET NET WORTH SUMMARY
// ==========================================

export const getNetWorthSummary = async (req, res) => {
    const userId = req.user.id;

    const accounts = await Account.find({
        user: userId,
        isActive: true
    }).select("accountType balance");

    const investments = await Investment.find({
        user: userId,
        isActive: true
    }).select("quantity currentPrice");

    let bankBalance = 0;
    let cashBalance = 0;
    let investmentValue = 0;
    let creditCardBalance = 0;
    let loanBalance = 0;

    accounts.forEach((account) => {
        const balance = Number(account.balance) || 0;

        if (account.accountType === "bank") {
            bankBalance += balance;
        }

        else if (account.accountType === "cash") {
            cashBalance += balance;
        }

        else if (account.accountType === "credit_card") {
            creditCardBalance += Math.abs(balance);
        }

        else if (account.accountType === "loan") {
            loanBalance += Math.abs(balance);
        }
    });

    investments.forEach((investment) => {
        const quantity =
            Number(investment.quantity) || 0;

        const currentPrice =
            Number(investment.currentPrice) || 0;

        investmentValue +=
            quantity * currentPrice;
    });

    const totalAssets =
        bankBalance +
        cashBalance +
        investmentValue;

    const totalLiabilities =
        creditCardBalance +
        loanBalance;

    const netWorth =
        totalAssets -
        totalLiabilities;

    res.status(200).json({
        success: true,
        data: {
            netWorth,
            totalAssets,
            totalLiabilities,

            assets: {
                bankBalance,
                cashBalance,
                investmentValue
            },

            liabilities: {
                creditCardBalance,
                loanBalance
            }
        }
    });
};

// ==========================================
// GET REAL NET WORTH HISTORY
// ==========================================

export const getNetWorthHistory = async (req, res) => {
    const userId = req.user.id;

    let months =
        Number(req.query.months) || 6;

    if (months < 1) {
        months = 1;
    }

    if (months > 24) {
        months = 24;
    }

    const startDate = new Date();

    startDate.setMonth(
        startDate.getMonth() - months
    );

    const snapshots =
        await NetWorthSnapshot.find({
            user: userId,

            snapshotDate: {
                $gte: startDate
            }
        })
        .sort({
            snapshotDate: 1
        })
        .select(
            "snapshotDate totalAssets totalLiabilities netWorth bankBalance cashBalance investmentValue creditCardBalance loanBalance currency"
        );

    const history = snapshots.map(
        (snapshot) => ({
            date: snapshot.snapshotDate,

            totalAssets:
                snapshot.totalAssets,

            totalLiabilities:
                snapshot.totalLiabilities,

            netWorth:
                snapshot.netWorth,

            bankBalance:
                snapshot.bankBalance,

            cashBalance:
                snapshot.cashBalance,

            investmentValue:
                snapshot.investmentValue,

            creditCardBalance:
                snapshot.creditCardBalance,

            loanBalance:
                snapshot.loanBalance,

            currency:
                snapshot.currency
        })
    );

    res.status(200).json({
        success: true,
        months,
        count: history.length,
        data: history
    });
};