import mongoose from "mongoose";

const financialGoalSchema = new mongoose.Schema(
    {
        // ==========================================
        // USER
        // ==========================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // ==========================================
        // GOAL INFORMATION
        // ==========================================

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

        category: {
            type: String,
            enum: [
                "emergency_fund",
                "travel",
                "vehicle",
                "home",
                "education",
                "wedding",
                "retirement",
                "investment",
                "shopping",
                "other"
            ],
            default: "other"
        },

        // ==========================================
        // MONEY
        // ==========================================

        targetAmount: {
            type: Number,
            required: true,
            min: 1
        },

        currentAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true,
            trim: true
        },

        // ==========================================
        // TARGET DATE
        // ==========================================

        targetDate: {
            type: Date,
            required: true
        },

        // ==========================================
        // STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "active",
                "completed",
                "paused",
                "cancelled"
            ],
            default: "active"
        },

        // ==========================================
        // ACTIVE FLAG
        // ==========================================

        isActive: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

// ==========================================
// INDEXES
// ==========================================

financialGoalSchema.index({
    user: 1,
    status: 1
});

financialGoalSchema.index({
    user: 1,
    targetDate: 1
});

const FinancialGoal = mongoose.model(
    "FinancialGoal",
    financialGoalSchema
);

export default FinancialGoal;