import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight
} from "lucide-react";


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


const NetWorthCard = ({ data }) => {

    if (!data) {
        return null;
    }

    const {
        netWorth,
        totalAssets,
        totalLiabilities
    } = data;


    const isPositive = netWorth >= 0;


    return (

        <div
            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200/60
                dark:border-white/10
                bg-white/70
                dark:bg-slate-900/60
                backdrop-blur-xl
                p-6
                shadow-xl
            "
        >

            {/* Background glow */}

            <div
                className="
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-emerald-500/10
                    blur-3xl
                "
            />


            <div
                className="
                    relative
                    flex
                    items-start
                    justify-between
                "
            >

                <div>

                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >

                        <Wallet
                            size={18}
                        />

                        Total Net Worth

                    </div>


                    <h2
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            dark:text-white
                        "
                    >

                        {formatCurrency(netWorth)}

                    </h2>


                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            gap-2
                        "
                    >

                        {isPositive ? (

                            <TrendingUp
                                size={17}
                                className="
                                    text-emerald-500
                                "
                            />

                        ) : (

                            <TrendingDown
                                size={17}
                                className="
                                    text-red-500
                                "
                            />

                        )}


                        <span
                            className={`
                                text-sm
                                font-semibold
                                ${
                                    isPositive
                                        ? "text-emerald-500"
                                        : "text-red-500"
                                }
                            `}
                        >

                            {isPositive
                                ? "Positive Net Worth"
                                : "Negative Net Worth"
                            }

                        </span>

                    </div>

                </div>


                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-emerald-500/10
                        text-emerald-500
                    "
                >

                    <ArrowUpRight
                        size={22}
                    />

                </div>

            </div>


            {/* Assets / liabilities */}

            <div
                className="
                    relative
                    mt-6
                    grid
                    grid-cols-2
                    gap-4
                "
            >

                <div
                    className="
                        rounded-2xl
                        bg-emerald-500/5
                        p-4
                    "
                >

                    <p
                        className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Total Assets
                    </p>

                    <p
                        className="
                            mt-1
                            text-lg
                            font-bold
                            text-emerald-600
                            dark:text-emerald-400
                        "
                    >
                        {formatCurrency(totalAssets)}
                    </p>

                </div>


                <div
                    className="
                        rounded-2xl
                        bg-red-500/5
                        p-4
                    "
                >

                    <p
                        className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Total Liabilities
                    </p>

                    <p
                        className="
                            mt-1
                            text-lg
                            font-bold
                            text-red-600
                            dark:text-red-400
                        "
                    >
                        {formatCurrency(totalLiabilities)}
                    </p>

                </div>

            </div>

        </div>

    );

};


export default NetWorthCard;