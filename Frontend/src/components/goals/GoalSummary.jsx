const GoalSummary = ({
    summary
}) => {

    if (!summary) {
        return null;
    }

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(value || 0);
    };

    const cards = [
        {
            title: "Total Goals",
            value: summary.totalGoals,
            icon: "🎯",
            description: "All active goals"
        },
        {
            title: "Active Goals",
            value: summary.activeGoals,
            icon: "⚡",
            description: "Currently saving"
        },
        {
            title: "Total Saved",
            value: formatCurrency(
                summary.totalSavedAmount
            ),
            icon: "💰",
            description: "Across all goals"
        },
        {
            title: "Remaining",
            value: formatCurrency(
                summary.remainingAmount
            ),
            icon: "📊",
            description: "Still to save"
        }
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="
                        group
                        relative
                        overflow-hidden
                        rounded-3xl
                        border
                        border-gray-200/70
                        bg-white/70
                        p-5
                        shadow-lg
                        shadow-gray-200/20
                        backdrop-blur-2xl
                        transition-all
                        hover:-translate-y-1
                        dark:border-white/10
                        dark:bg-white/[0.06]
                        dark:shadow-black/20
                    "
                >

                    <div
                        className="
                            absolute
                            -right-10
                            -top-10
                            h-24
                            w-24
                            rounded-full
                            bg-blue-500/10
                            blur-2xl
                        "
                    />

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {card.title}
                            </p>

                            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {card.value}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                {card.description}
                            </p>

                        </div>

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-blue-500/10
                                to-violet-500/10
                                text-xl
                            "
                        >
                            {card.icon}
                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
};

export default GoalSummary;