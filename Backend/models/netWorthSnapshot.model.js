import mongoose from "mongoose";

const netWorthSnapshotSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        snapshotDate: {
            type: Date,
            required: true,
            index: true
        },

        totalAssets: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },

        totalLiabilities: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },

        netWorth: {
            type: Number,
            required: true,
            default: 0
        },

        bankBalance: {
            type: Number,
            default: 0,
            min: 0
        },

        cashBalance: {
            type: Number,
            default: 0,
            min: 0
        },

        investmentValue: {
            type: Number,
            default: 0,
            min: 0
        },

        creditCardBalance: {
            type: Number,
            default: 0,
            min: 0
        },

        loanBalance: {
            type: Number,
            default: 0,
            min: 0
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true
        }
    },
    {
        timestamps: true
    }
);


// One snapshot per user per day
netWorthSnapshotSchema.index(
    {
        user: 1,
        snapshotDate: 1
    },
    {
        unique: true
    }
);


const NetWorthSnapshot = mongoose.model(
    "NetWorthSnapshot",
    netWorthSnapshotSchema
);

export default NetWorthSnapshot;