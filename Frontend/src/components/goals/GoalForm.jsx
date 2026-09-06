import { useState } from "react";

const initialForm = {
    name: "",
    description: "",
    category: "other",
    targetAmount: "",
    currentAmount: "",
    currency: "INR",
    targetDate: ""
};

const categories = [
    {
        value: "emergency_fund",
        label: "Emergency Fund",
        icon: "🛡️"
    },
    {
        value: "travel",
        label: "Travel",
        icon: "✈️"
    },
    {
        value: "vehicle",
        label: "Vehicle",
        icon: "🚗"
    },
    {
        value: "home",
        label: "Home",
        icon: "🏠"
    },
    {
        value: "education",
        label: "Education",
        icon: "🎓"
    },
    {
        value: "wedding",
        label: "Wedding",
        icon: "💍"
    },
    {
        value: "retirement",
        label: "Retirement",
        icon: "🌅"
    },
    {
        value: "investment",
        label: "Investment",
        icon: "📈"
    },
    {
        value: "shopping",
        label: "Shopping",
        icon: "🛍️"
    },
    {
        value: "other",
        label: "Other",
        icon: "🎯"
    }
];

const getInitialForm = (goal) => {

    if (!goal) {
        return {
            ...initialForm
        };
    }

    return {
        name: goal.name || "",

        description:
            goal.description || "",

        category:
            goal.category || "other",

        targetAmount:
            goal.targetAmount ?? "",

        currentAmount:
            goal.currentAmount ?? "",

        currency:
            goal.currency || "INR",

        targetDate:
            goal.targetDate
                ? new Date(
                      goal.targetDate
                  )
                      .toISOString()
                      .split("T")[0]
                : ""
    };
};

const GoalForm = ({
    goal,
    onSubmit,
    onClose,
    loading
}) => {

    // ==========================================
    // STATE
    // ==========================================

    const [form, setForm] = useState(
        () => getInitialForm(goal)
    );

    const [error, setError] =
        useState("");

    const isEditing =
        Boolean(goal);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        if (error) {
            setError("");
        }
    };

    // ==========================================
    // HANDLE CATEGORY
    // ==========================================

    const handleCategoryChange = (
        category
    ) => {

        setForm((previous) => ({
            ...previous,
            category
        }));

        if (error) {
            setError("");
        }
    };

    // ==========================================
    // HANDLE SUBMIT
    // ==========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");

        // Goal name validation

        if (!form.name.trim()) {

            setError(
                "Please enter a goal name."
            );

            return;
        }

        // Target amount validation

        if (
            !form.targetAmount ||
            Number(form.targetAmount) <= 0
        ) {

            setError(
                "Target amount must be greater than 0."
            );

            return;
        }

        // Current amount validation

        if (
            Number(form.currentAmount || 0) < 0
        ) {

            setError(
                "Current amount cannot be negative."
            );

            return;
        }

        // Current amount cannot exceed target

        if (
            Number(form.currentAmount || 0) >
            Number(form.targetAmount)
        ) {

            setError(
                "Current amount cannot exceed target amount."
            );

            return;
        }

        // Target date validation

        if (!form.targetDate) {

            setError(
                "Please select a target date."
            );

            return;
        }

        try {

            await onSubmit({

                name:
                    form.name.trim(),

                description:
                    form.description.trim(),

                category:
                    form.category,

                targetAmount:
                    Number(
                        form.targetAmount
                    ),

                currentAmount:
                    Number(
                        form.currentAmount || 0
                    ),

                currency:
                    form.currency,

                targetDate:
                    form.targetDate

            });

        } catch (err) {

            setError(
                err?.message ||
                "Failed to save goal."
            );
        }
    };

    // ==========================================
    // UI
    // ==========================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/50
                p-4
                backdrop-blur-md
            "
            onMouseDown={onClose}
        >

            <div
                className="
                    max-h-[90vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-3xl
                    border
                    border-white/20
                    bg-white/90
                    p-6
                    shadow-2xl
                    backdrop-blur-2xl
                    dark:border-white/10
                    dark:bg-gray-950/90
                "
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                {/* ======================================
                    HEADER
                ====================================== */}

                <div
                    className="
                        mb-6
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-widest
                                text-blue-500
                            "
                        >
                            Finora Goals
                        </p>

                        <h2
                            className="
                                mt-1
                                text-2xl
                                font-bold
                                text-gray-900
                                dark:text-white
                            "
                        >
                            {isEditing
                                ? "Edit Financial Goal"
                                : "Create Financial Goal"}
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Turn your plans into measurable
                            financial goals.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-gray-100
                            text-gray-500
                            transition
                            hover:bg-gray-200
                            dark:bg-white/10
                            dark:text-gray-300
                            dark:hover:bg-white/20
                        "
                    >
                        ✕
                    </button>

                </div>

                {/* ======================================
                    ERROR
                ====================================== */}

                {error && (

                    <div
                        className="
                            mb-5
                            rounded-2xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-4
                            py-3
                            text-sm
                            text-red-500
                        "
                    >
                        {error}
                    </div>

                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* ==================================
                        GOAL NAME
                    ================================== */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-gray-300
                            "
                        >
                            Goal Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Emergency Fund"
                            autoComplete="off"
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-gray-200
                                bg-gray-50/70
                                px-4
                                py-3
                                text-sm
                                text-gray-900
                                outline-none
                                transition
                                placeholder:text-gray-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-white
                            "
                        />

                    </div>

                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-gray-300
                            "
                        >
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                form.description
                            }
                            onChange={
                                handleChange
                            }
                            rows={3}
                            placeholder="What are you saving for?"
                            className="
                                w-full
                                resize-none
                                rounded-2xl
                                border
                                border-gray-200
                                bg-gray-50/70
                                px-4
                                py-3
                                text-sm
                                text-gray-900
                                outline-none
                                transition
                                placeholder:text-gray-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-white
                            "
                        />

                    </div>

                    {/* ==================================
                        CATEGORY
                    ================================== */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-gray-300
                            "
                        >
                            Category
                        </label>

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-2
                                sm:grid-cols-5
                            "
                        >

                            {categories.map(
                                (category) => (

                                    <button
                                        key={
                                            category.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleCategoryChange(
                                                category.value
                                            )
                                        }
                                        className={`
                                            rounded-2xl
                                            border
                                            p-3
                                            text-center
                                            transition
                                            hover:-translate-y-0.5

                                            ${
                                                form.category ===
                                                category.value
                                                    ? "border-blue-500 bg-blue-500/10 shadow-sm shadow-blue-500/10"
                                                    : "border-gray-200 bg-gray-50/50 hover:border-blue-300 dark:border-white/10 dark:bg-white/5"
                                            }
                                        `}
                                    >

                                        <div className="text-xl">
                                            {
                                                category.icon
                                            }
                                        </div>

                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                font-medium
                                                text-gray-600
                                                dark:text-gray-300
                                            "
                                        >
                                            {
                                                category.label
                                            }
                                        </p>

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                    {/* ==================================
                        AMOUNTS
                    ================================== */}

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
                        "
                    >

                        {/* Target Amount */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                Target Amount
                            </label>

                            <div className="relative">

                                <span
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-sm
                                        text-gray-400
                                    "
                                >
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="targetAmount"
                                    min="1"
                                    step="0.01"
                                    value={
                                        form.targetAmount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="300000"
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-gray-50/70
                                        py-3
                                        pl-9
                                        pr-4
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-500/20
                                        dark:border-white/10
                                        dark:bg-white/5
                                        dark:text-white
                                    "
                                />

                            </div>

                        </div>

                        {/* Current Amount */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    dark:text-gray-300
                                "
                            >
                                Already Saved
                            </label>

                            <div className="relative">

                                <span
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-sm
                                        text-gray-400
                                    "
                                >
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="currentAmount"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.currentAmount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="50000"
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-gray-50/70
                                        py-3
                                        pl-9
                                        pr-4
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-500/20
                                        dark:border-white/10
                                        dark:bg-white/5
                                        dark:text-white
                                    "
                                />

                            </div>

                        </div>

                    </div>

                    {/* ==================================
                        TARGET DATE
                    ================================== */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                dark:text-gray-300
                            "
                        >
                            Target Date
                        </label>

                        <input
                            type="date"
                            name="targetDate"
                            value={
                                form.targetDate
                            }
                            onChange={
                                handleChange
                            }
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-gray-200
                                bg-gray-50/70
                                px-4
                                py-3
                                text-sm
                                text-gray-900
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-white
                            "
                        />

                    </div>

                    {/* ==================================
                        ACTIONS
                    ================================== */}

                    <div
                        className="
                            flex
                            gap-3
                            pt-3
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                flex-1
                                rounded-2xl
                                border
                                border-gray-200
                                bg-gray-100
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-gray-700
                                transition
                                hover:bg-gray-200
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-gray-300
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex-1
                                rounded-2xl
                                bg-gradient-to-r
                                from-blue-500
                                to-violet-500
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-blue-500/20
                                transition
                                hover:scale-[1.01]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                    ? "Update Goal"
                                    : "Create Goal"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default GoalForm;