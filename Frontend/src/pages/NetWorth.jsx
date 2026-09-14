import { useEffect, useState } from "react";

import {
    getNetWorth,
    getNetWorthBreakdown,
    getNetWorthHistory
} from "../services/netWorthApi.js";

import Navbar from "../components/Navbar.jsx";
import NetWorthCard
    from "../components/networth/NetWorthCard.jsx";

import NetWorthBreakdown
    from "../components/networth/NetWorthBreakdown.jsx";

import NetWorthChart
    from "../components/networth/NetWorthChart.jsx";


const NetWorth = () => {

    const [netWorth, setNetWorth] =
        useState(null);

    const [breakdown, setBreakdown] =
        useState(null);

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD DATA
    // ==========================================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");


            const [
                netWorthData,
                breakdownData,
                historyData
            ] = await Promise.all([

                getNetWorth(),

                getNetWorthBreakdown(),

                getNetWorthHistory(6)

            ]);


            setNetWorth(netWorthData);

            setBreakdown(breakdownData);

            setHistory(historyData || []);

        }

        catch (err) {

            setError(
                err.message ||
                "Failed to load net worth data"
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // INITIAL DATA LOAD
    // ==========================================

    useEffect(() => {

        let cancelled = false;


        const fetchInitialData = async () => {

            try {

                const [
                    netWorthData,
                    breakdownData,
                    historyData
                ] = await Promise.all([

                    getNetWorth(),

                    getNetWorthBreakdown(),

                    getNetWorthHistory(6)

                ]);


                if (cancelled) {
                    return;
                }


                setNetWorth(netWorthData);

                setBreakdown(breakdownData);

                setHistory(historyData || []);

            }

            catch (err) {

                if (cancelled) {
                    return;
                }


                setError(
                    err.message ||
                    "Failed to load net worth data"
                );

            }

            finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        };


        fetchInitialData();


        return () => {

            cancelled = true;

        };

    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center">

                <div className="text-gray-400">

                    Loading net worth...

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="flex min-h-screen items-center justify-center">

                <div className="text-center">

                    <p className="mb-4 text-red-400">

                        {error}

                    </p>


                    <button
                        onClick={loadData}
                        className="rounded-xl bg-white/10 px-5 py-2 hover:bg-white/20"
                    >

                        Try Again

                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="min-h-screen px-4 pb-16 pt-28 text-slate-900 dark:text-white sm:px-6 lg:px-8">
            <Navbar />
            <div className="mx-auto max-w-7xl">


                {/* HEADER */}

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold">

                            Net Worth

                        </h1>

                        <p className="mt-1 text-gray-400">

                            Track your financial position over time.

                        </p>

                    </div>


                    <button
                        onClick={loadData}
                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-xl hover:bg-white/10"
                    >

                        Refresh

                    </button>

                </div>


                {/* CURRENT NET WORTH */}

                <NetWorthCard
                    data={netWorth}
                />


                {/* BREAKDOWN */}

                <div className="mt-6">

                    <NetWorthBreakdown
                        data={breakdown}
                    />

                </div>


                {/* HISTORY */}

                <div className="mt-6">

                    <NetWorthChart
                        history={history}
                    />

                </div>


            </div>

        </div>

    );

};


export default NetWorth;