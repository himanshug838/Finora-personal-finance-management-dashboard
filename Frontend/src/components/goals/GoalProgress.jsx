const GoalProgress = ({
    currentAmount = 0,
    targetAmount = 0,
    progress = 0
}) => {

    const safeProgress =
        Math.min(
            Math.max(Number(progress) || 0, 0),
            100
        );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="space-y-3">

            <div className="flex items-end justify-between">

                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Saved
                    </p>

                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(currentAmount)}
                    </p>
                </div>

                <div className="text-right">

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Target
                    </p>

                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {formatCurrency(targetAmount)}
                    </p>

                </div>

            </div>

            <div className="relative h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">

                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-700"
                    style={{
                        width: `${safeProgress}%`
                    }}
                />

            </div>

            <div className="flex justify-between text-xs">

                <span className="text-gray-500 dark:text-gray-400">
                    Progress
                </span>

                <span className="font-semibold text-blue-500">
                    {safeProgress.toFixed(0)}%
                </span>

            </div>

        </div>
    );
};

export default GoalProgress;