import {
    Building2,
    Banknote,
    CreditCard,
    Landmark,
    TrendingUp
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


const NetWorthBreakdown = ({ data }) => {

    if (!data) {
        return null;
    }


    const {
        accounts = {},
        investments = {}
    } = data;


    const items = [

        {
            name: "Bank Accounts",
            value: accounts.bank || 0,
            icon: Building2,
            type: "asset"
        },

        {
            name: "Cash",
            value: accounts.cash || 0,
            icon: Banknote,
            type: "asset"
        },

        {
            name: "Investments",
            value:
                Object.values(investments)
                    .reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ),
            icon: TrendingUp,
            type: "asset"
        },

        {
            name: "Credit Cards",
            value: accounts.creditCards || 0,
            icon: CreditCard,
            type: "liability"
        },

        {
            name: "Loans",
            value: accounts.loans || 0,
            icon: Landmark,
            type: "liability"
        }

    ];


    return (

        <div
            className="
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

            <div className="mb-6">

                <h3
                    className="
                        text-xl
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    Net Worth Breakdown
                </h3>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Overview of your assets and liabilities
                </p>

            </div>


            <div className="space-y-4">

                {items.map((item) => {

                    const Icon = item.icon;

                    const isAsset =
                        item.type === "asset";


                    return (

                        <div
                            key={item.name}
                            className="
                                flex
                                items-center
                                justify-between
                                rounded-2xl
                                border
                                border-slate-100
                                dark:border-white/5
                                bg-slate-50/70
                                dark:bg-white/[0.03]
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className={`
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        ${
                                            isAsset
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : "bg-red-500/10 text-red-500"
                                        }
                                    `}
                                >

                                    <Icon
                                        size={19}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-800
                                            dark:text-slate-200
                                        "
                                    >
                                        {item.name}
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        {isAsset
                                            ? "Asset"
                                            : "Liability"
                                        }
                                    </p>

                                </div>

                            </div>


                            <p
                                className={`
                                    font-bold
                                    ${
                                        isAsset
                                            ? "text-emerald-500"
                                            : "text-red-500"
                                    }
                                `}
                            >

                                {formatCurrency(item.value)}

                            </p>

                        </div>

                    );

                })}

            </div>

        </div>

    );

};


export default NetWorthBreakdown;