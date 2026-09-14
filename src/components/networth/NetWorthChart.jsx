import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";


const NetWorthChart = ({ history = [] }) => {

    const chartData = history.map((item) => ({

        date: new Date(
            item.date
        ).toLocaleDateString(
            "en-IN",
            {
                month: "short",
                day: "numeric"
            }
        ),

        netWorth:
            item.netWorth,

        assets:
            item.totalAssets,

        liabilities:
            item.totalLiabilities

    }));


    return (

        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

            <div className="mb-6">

                <h2 className="text-xl font-semibold">

                    Net Worth History

                </h2>

                <p className="text-sm text-gray-400">

                    Track how your net worth changes over time

                </p>

            </div>


            {chartData.length === 0 ? (

                <div className="flex h-[300px] items-center justify-center text-gray-400">

                    No historical data available yet.

                </div>

            ) : (

                <div className="h-[300px] w-full">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <LineChart
                            data={chartData}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                opacity={0.15}
                            />

                            <XAxis
                                dataKey="date"
                            />

                            <YAxis />

                            <Tooltip
                                formatter={(value) =>
                                    `₹${Number(value).toLocaleString("en-IN")}`
                                }
                            />

                            <Line
                                type="monotone"
                                dataKey="netWorth"
                                strokeWidth={3}
                                dot={false}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            )}

        </div>

    );
};


export default NetWorthChart;