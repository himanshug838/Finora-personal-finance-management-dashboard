import GoalProgress from "./GoalProgress.jsx";

const categoryIcons = {
    emergency_fund: "🛡️",
    travel: "✈️",
    vehicle: "🚗",
    home: "🏠",
    education: "🎓",
    wedding: "💍",
    retirement: "🌅",
    investment: "📈",
    shopping: "🛍️",
    other: "🎯"
};

const categoryNames = {
    emergency_fund: "Emergency Fund",
    travel: "Travel",
    vehicle: "Vehicle",
    home: "Home",
    education: "Education",
    wedding: "Wedding",
    retirement: "Retirement",
    investment: "Investment",
    shopping: "Shopping",
    other: "Other"
};

const GoalCard = ({
    goal,
    onAddMoney,
    onWithdraw,
    onEdit,
    onDelete
}) => {

    const {
        _id,
        name,
        description,
        category,
        targetAmount,
        currentAmount,
        remainingAmount,
        progressPercentage,
        targetDate,
        status
    } = goal;

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: goal.currency || "INR",
                maximumFractionDigits: 0
            }
        ).format(value || 0);
    };

    const formattedDate =
        targetDate
            ? new Date(targetDate).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )
            : "No date";

    const daysRemaining =
        targetDate
            ? Math.ceil(
                (
                    new Date(targetDate) -
                    new Date()
                ) /
                (1000 * 60 * 60 * 24)
            )
            : null;

    const isCompleted =
        status === "completed";

    const isPaused =
        status === "paused";

    return (
        <div
            className="
                group relative overflow-hidden
                rounded-3xl
                border border-gray-200/70
                bg-white/70
                p-5
                shadow-lg shadow-gray-200/30
                backdrop-blur-2xl
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                dark:border-white/10
                dark:bg-white/[0.06]
                dark:shadow-black/20
            "
        >

            {/* Glow */}

            <div
                className="
                    pointer-events-none
                    absolute -right-16 -top-16
                    h-32 w-32
                    rounded-full
                    bg-blue-500/10
                    blur-3xl
                    transition-all
                    group-hover:bg-violet-500/20
                "
            />

            {/* Header */}

            <div className="relative flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex h-12 w-12
                            items-center justify-center
                            rounded-2xl
                            border border-white/20
                            bg-gradient-to-br
                            from-blue-500/15
                            to-violet-500/15
                            text-2xl
                            shadow-inner
                        "
                    >
                        {categoryIcons[category] || "🎯"}
                    </div>

                    <div>

                        <h3 className="font-bold text-gray-900 dark:text-white">
                            {name}
                        </h3>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {categoryNames[category] || "Other"}
                        </p>

                    </div>

                </div>

                {/* Status */}

                <span
                    className={`
                        rounded-full
                        px-3 py-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide

                        ${
                            isCompleted
                                ? "bg-emerald-500/10 text-emerald-500"
                                : isPaused
                                    ? "bg-amber-500/10 text-amber-500"
                                    : "bg-blue-500/10 text-blue-500"
                        }
                    `}
                >
                    {status}
                </span>

            </div>

            {/* Description */}

            {description && (
                <p className="relative mt-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            )}

            {/* Progress */}

            <div className="relative mt-6">

                <GoalProgress
                    currentAmount={currentAmount}
                    targetAmount={targetAmount}
                    progress={progressPercentage}
                />

            </div>

            {/* Remaining */}

            <div
                className="
                    relative mt-5
                    flex items-center justify-between
                    rounded-2xl
                    border border-gray-100
                    bg-gray-50/80
                    px-4 py-3
                    dark:border-white/5
                    dark:bg-black/10
                "
            >

                <div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Remaining
                    </p>

                    <p className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(remainingAmount)}
                    </p>

                </div>

                <div className="text-right">

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Target date
                    </p>

                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {formattedDate}
                    </p>

                </div>

            </div>

            {/* Days */}

            {daysRemaining !== null && !isCompleted && (

                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">

                    {daysRemaining > 0
                        ? `${daysRemaining} days remaining`
                        : "Target date reached"}

                </p>

            )}

            {/* Actions */}

            <div className="relative mt-5 grid grid-cols-2 gap-2">

                {!isCompleted && (
                    <button
                        onClick={() => onAddMoney(goal)}
                        className="
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-500
                            to-violet-500
                            px-3 py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                            transition
                            hover:scale-[1.02]
                            hover:shadow-blue-500/30
                        "
                    >
                        + Add Money
                    </button>
                )}

                <button
                    onClick={() => onWithdraw(goal)}
                    disabled={currentAmount <= 0}
                    className="
                        rounded-xl
                        border border-gray-200
                        bg-white/60
                        px-3 py-2.5
                        text-sm
                        font-semibold
                        text-gray-700
                        transition
                        hover:bg-gray-100
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        dark:border-white/10
                        dark:bg-white/5
                        dark:text-gray-300
                        dark:hover:bg-white/10
                    "
                >
                    Withdraw
                </button>

            </div>

            {/* Secondary actions */}

            <div className="relative mt-3 flex items-center justify-between">

                <button
                    onClick={() => onEdit(goal)}
                    className="
                        text-xs
                        font-medium
                        text-gray-500
                        transition
                        hover:text-blue-500
                        dark:text-gray-400
                    "
                >
                    Edit goal
                </button>

                <button
                    onClick={() => onDelete(_id)}
                    className="
                        text-xs
                        font-medium
                        text-red-500/80
                        transition
                        hover:text-red-500
                    "
                >
                    Delete
                </button>

            </div>

        </div>
    );
};

export default GoalCard;