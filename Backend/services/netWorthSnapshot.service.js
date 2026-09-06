import Account from "../models/account.model.js";
import Investment from "../models/investment.model.js";
import NetWorthSnapshot from "../models/netWorthSnapshot.model.js";


// ==========================================
// GET START OF DAY
// ==========================================

const getStartOfDay = (date = new Date()) => {

    const start = new Date(date);

    start.setHours(0, 0, 0, 0);

    return start;
};


// ==========================================
// CALCULATE CURRENT NET WORTH
// ==========================================

export const calculateCurrentNetWorth = async (userId) => {

    const accounts = await Account.find({
        user: userId,
        isActive: true
    }).select(
        "accountType balance currency"
    );


    const investments = await Investment.find({
        user: userId,
        isActive: true
    }).select(
        "quantity currentPrice currency"
    );


    let bankBalance = 0;

    let cashBalance = 0;

    let creditCardBalance = 0;

    let loanBalance = 0;


    // ==========================================
    // ACCOUNT CALCULATIONS
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


            // investment accounts are intentionally
            // not included here

            case "investment":

                break;


            default:

                break;
        }

    });


    // ==========================================
    // INVESTMENT CALCULATION
    // ==========================================

    let investmentValue = 0;


    investments.forEach((investment) => {

        const quantity =
            Number(investment.quantity) || 0;

        const currentPrice =
            Number(investment.currentPrice) || 0;


        investmentValue +=
            quantity * currentPrice;

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


    return {

        totalAssets,

        totalLiabilities,

        netWorth,

        bankBalance,

        cashBalance,

        investmentValue,

        creditCardBalance,

        loanBalance
    };
};


// ==========================================
// CREATE / UPDATE TODAY'S SNAPSHOT
// ==========================================

export const createNetWorthSnapshot = async (userId) => {

    const snapshotDate =
        getStartOfDay();


    const calculatedData =
        await calculateCurrentNetWorth(userId);


    const snapshot =
        await NetWorthSnapshot.findOneAndUpdate(

            {
                user: userId,
                snapshotDate
            },

            {
                $set: {
                    ...calculatedData,
                    currency: "INR"
                }
            },

            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );


    return snapshot;
};