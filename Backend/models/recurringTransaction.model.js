import mongoose from "mongoose";

const recurringTransactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        type: {
            type: String,
            enum: ["income", "expense"],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        category: {
            type: String,
            trim: true,
            default: "other"
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true
        },

        frequency: {
            type: String,
            enum: [
                "daily",
                "weekly",
                "monthly",
                "yearly"
            ],
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            default: null
        },

        nextRunDate: {
            type: Date,
            required: true,
            index: true
        },

        lastRunDate: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: [
                "active",
                "paused",
                "completed",
                "cancelled"
            ],
            default: "active",
            index: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

recurringTransactionSchema.index({
    user: 1,
    status: 1,
    nextRunDate: 1
});

const RecurringTransaction =
    mongoose.model(
        "RecurringTransaction",
        recurringTransactionSchema
    );

export default RecurringTransaction;