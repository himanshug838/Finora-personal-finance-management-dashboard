import { useEffect, useState } from "react";

import {
    getFinancialGoals,
    getFinancialGoalSummary,
    createFinancialGoal,
    updateFinancialGoal,
    addMoneyToGoal,
    withdrawMoneyFromGoal,
    deleteFinancialGoal
} from "../services/financialGoalApi.js";

import Navbar from "../components/Navbar.jsx";
import GoalCard from "../components/goals/GoalCard.jsx";
import GoalSummary from "../components/goals/GoalSummary.jsx";
import GoalForm from "../components/goals/GoalForm.jsx";
import AddMoneyModal from "../components/goals/AddMoneyModal.jsx";
import DeleteGoalModal from "../components/goals/DeleteGoalModal.jsx";

const FinancialGoals = () => {

    // ==========================================
    // STATE
    // ==========================================

    const [goals, setGoals] = useState([]);

    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingGoal, setEditingGoal] =
        useState(null);

    const [moneyModal, setMoneyModal] =
        useState(null);

    const [deleteGoalId, setDeleteGoalId] =
        useState(null);

    // ==========================================
    // LOAD DATA
    // ==========================================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                goalsData,
                summaryData
            ] = await Promise.all([
                getFinancialGoals({
                    status: statusFilter,
                    category: categoryFilter
                }),

                getFinancialGoalSummary()
            ]);

            setGoals(goalsData || []);

            setSummary(summaryData);

        } catch (err) {

            setError(
                err?.message ||
                "Failed to load financial goals."
            );

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // INITIAL / FILTERED DATA LOAD
    // ==========================================

    useEffect(() => {

        let cancelled = false;

        const fetchData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    goalsData,
                    summaryData
                ] = await Promise.all([
                    getFinancialGoals({
                        status: statusFilter,
                        category: categoryFilter
                    }),

                    getFinancialGoalSummary()
                ]);

                if (cancelled) {
                    return;
                }

                setGoals(
                    goalsData || []
                );

                setSummary(
                    summaryData
                );

            } catch (err) {

                if (cancelled) {
                    return;
                }

                setError(
                    err?.message ||
                    "Failed to load financial goals."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };

    }, [statusFilter, categoryFilter]);

    // ==========================================
    // CREATE / UPDATE GOAL
    // ==========================================

    const handleGoalSubmit = async (
        goalData
    ) => {

        setActionLoading(true);

        try {

            if (editingGoal) {

                await updateFinancialGoal(
                    editingGoal._id,
                    goalData
                );

            } else {

                await createFinancialGoal(
                    goalData
                );
            }

            setShowForm(false);

            setEditingGoal(null);

            await loadData();

        } finally {

            setActionLoading(false);
        }
    };

    // ==========================================
    // ADD / WITHDRAW MONEY
    // ==========================================

    const handleMoneySubmit = async (
        amount
    ) => {

        if (!moneyModal) {
            return;
        }

        setActionLoading(true);

        try {

            if (
                moneyModal.mode === "add"
            ) {

                await addMoneyToGoal(
                    moneyModal.goal._id,
                    amount
                );

            } else {

                await withdrawMoneyFromGoal(
                    moneyModal.goal._id,
                    amount
                );
            }

            setMoneyModal(null);

            await loadData();

        } finally {

            setActionLoading(false);
        }
    };

    // ==========================================
    // DELETE GOAL
    // ==========================================

    const handleDelete = async () => {

        if (!deleteGoalId) {
            return;
        }

        setActionLoading(true);

        try {

            await deleteFinancialGoal(
                deleteGoalId
            );

            setDeleteGoalId(null);

            await loadData();

        } catch (err) {

            setError(
                err?.message ||
                "Failed to delete financial goal."
            );

        } finally {

            setActionLoading(false);
        }
    };

    // ==========================================
    // SEARCH
    // ==========================================

    const filteredGoals = goals.filter(
        (goal) => {

            const query =
                search
                    .toLowerCase()
                    .trim();

            if (!query) {
                return true;
            }

            return (
                goal.name
                    ?.toLowerCase()
                    .includes(query) ||

                goal.description
                    ?.toLowerCase()
                    .includes(query) ||

                goal.category
                    ?.toLowerCase()
                    .includes(query)
            );
        }
    );

    // ==========================================
    // OPEN CREATE FORM
    // ==========================================

    const openCreateForm = () => {

        setEditingGoal(null);

        setShowForm(true);
    };

    // ==========================================
    // OPEN EDIT FORM
    // ==========================================

    const openEditForm = (goal) => {

        setEditingGoal(goal);

        setShowForm(true);
    };

    // ==========================================
    // CLOSE FORM
    // ==========================================

    const closeForm = () => {

        setShowForm(false);

        setEditingGoal(null);
    };

    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {

        setSearch("");

        setStatusFilter("");

        setCategoryFilter("");
    };

    const hasFilters =
        search ||
        statusFilter ||
        categoryFilter;

    // ==========================================
    // UI
    // ==========================================

    return (
        <div
            className="
                min-h-screen
                bg-gray-50
                px-4
                pb-16
                pt-28
                text-gray-900
                dark:bg-[#070b14]
                dark:text-white
                sm:px-6
                lg:px-8
            "
        >
            <Navbar />

            {/* ======================================
                BACKGROUND GLOW
            ====================================== */}

            <div
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    -z-0
                    overflow-hidden
                "
            >

                <div
                    className="
                        absolute
                        -left-32
                        top-20
                        h-96
                        w-96
                        rounded-full
                        bg-blue-500/10
                        blur-[120px]
                    "
                />

                <div
                    className="
                        absolute
                        -right-32
                        top-96
                        h-96
                        w-96
                        rounded-full
                        bg-violet-500/10
                        blur-[120px]
                    "
                />

                <div
                    className="
                        absolute
                        bottom-0
                        left-1/2
                        h-80
                        w-80
                        -translate-x-1/2
                        rounded-full
                        bg-cyan-500/5
                        blur-[120px]
                    "
                />

            </div>

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-7xl
                "
            >

                {/* ======================================
                    HEADER
                ====================================== */}

                <div
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-5
                        md:flex-row
                        md:items-end
                        md:justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-blue-500/20
                                    bg-blue-500/10
                                    px-3
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-widest
                                    text-blue-500
                                "
                            >
                                Finora Planning
                            </span>

                        </div>

                        <h1
                            className="
                                text-3xl
                                font-black
                                tracking-tight
                                text-gray-900
                                dark:text-white
                                sm:text-4xl
                            "
                        >
                            Financial Goals
                        </h1>

                        <p
                            className="
                                mt-2
                                max-w-xl
                                text-sm
                                leading-6
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            Set meaningful targets, track your
                            savings, and turn your financial plans
                            into reality.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            bg-gradient-to-r
                            from-blue-500
                            to-violet-500
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            shadow-xl
                            shadow-blue-500/20
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-blue-500/30
                        "
                    >

                        <span className="text-lg">
                            +
                        </span>

                        Create Goal

                    </button>

                </div>

                {/* ======================================
                    ERROR
                ====================================== */}

                {error && (

                    <div
                        className="
                            mb-6
                            flex
                            items-center
                            justify-between
                            gap-4
                            rounded-2xl
                            border
                            border-red-500/20
                            bg-red-500/10
                            px-5
                            py-4
                            text-sm
                            text-red-500
                        "
                    >

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-wide
                                hover:underline
                            "
                        >
                            Dismiss
                        </button>

                    </div>

                )}

                {/* ======================================
                    SUMMARY
                ====================================== */}

                <GoalSummary
                    summary={summary}
                />

                {/* ======================================
                    FILTER BAR
                ====================================== */}

                <div
                    className="
                        mt-8
                        rounded-3xl
                        border
                        border-gray-200/70
                        bg-white/60
                        p-4
                        shadow-lg
                        shadow-gray-200/20
                        backdrop-blur-2xl
                        dark:border-white/10
                        dark:bg-white/[0.04]
                        dark:shadow-black/10
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            lg:flex-row
                        "
                    >

                        {/* Search */}

                        <div
                            className="
                                relative
                                flex-1
                            "
                        >

                            <span
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            >
                                🔎
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search goals..."
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-white/70
                                    py-3
                                    pl-11
                                    pr-4
                                    text-sm
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

                        {/* Status */}

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white/70
                                px-4
                                py-3
                                text-sm
                                outline-none
                                transition
                                focus:border-blue-500
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-white
                            "
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                            <option value="paused">
                                Paused
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                        </select>

                        {/* Category */}

                        <select
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(
                                    event.target.value
                                )
                            }
                            className="
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white/70
                                px-4
                                py-3
                                text-sm
                                outline-none
                                transition
                                focus:border-blue-500
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-white
                            "
                        >

                            <option value="">
                                All Categories
                            </option>

                            <option value="emergency_fund">
                                Emergency Fund
                            </option>

                            <option value="travel">
                                Travel
                            </option>

                            <option value="vehicle">
                                Vehicle
                            </option>

                            <option value="home">
                                Home
                            </option>

                            <option value="education">
                                Education
                            </option>

                            <option value="wedding">
                                Wedding
                            </option>

                            <option value="retirement">
                                Retirement
                            </option>

                            <option value="investment">
                                Investment
                            </option>

                            <option value="shopping">
                                Shopping
                            </option>

                            <option value="other">
                                Other
                            </option>

                        </select>

                        {/* Clear Filters */}

                        {hasFilters && (

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-gray-100
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-gray-600
                                    transition
                                    hover:bg-gray-200
                                    dark:border-white/10
                                    dark:bg-white/5
                                    dark:text-gray-300
                                    dark:hover:bg-white/10
                                "
                            >
                                Clear
                            </button>

                        )}

                    </div>

                </div>

                {/* ======================================
                    RESULTS INFO
                ====================================== */}

                {!loading && goals.length > 0 && (

                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            justify-between
                            text-sm
                        "
                    >

                        <p className="text-gray-500 dark:text-gray-400">

                            Showing{" "}

                            <span
                                className="
                                    font-semibold
                                    text-gray-800
                                    dark:text-white
                                "
                            >
                                {filteredGoals.length}
                            </span>

                            {" "}of{" "}

                            <span
                                className="
                                    font-semibold
                                    text-gray-800
                                    dark:text-white
                                "
                            >
                                {goals.length}
                            </span>

                            {" "}goals

                        </p>

                        {(statusFilter ||
                            categoryFilter) && (

                            <span
                                className="
                                    hidden
                                    rounded-full
                                    bg-blue-500/10
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-blue-500
                                    sm:inline-flex
                                "
                            >
                                Filters active
                            </span>

                        )}

                    </div>

                )}

                {/* ======================================
                    GOALS
                ====================================== */}

                <div className="mt-6">

                    {loading ? (

                        <div
                            className="
                                grid
                                gap-5
                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {[1, 2, 3].map(
                                (item) => (

                                    <div
                                        key={item}
                                        className="
                                            h-[390px]
                                            animate-pulse
                                            rounded-3xl
                                            border
                                            border-gray-200/50
                                            bg-gray-200/70
                                            dark:border-white/5
                                            dark:bg-white/5
                                        "
                                    />

                                )
                            )}

                        </div>

                    ) : filteredGoals.length === 0 ? (

                        <div
                            className="
                                rounded-3xl
                                border
                                border-dashed
                                border-gray-300
                                bg-white/50
                                px-6
                                py-16
                                text-center
                                backdrop-blur-xl
                                dark:border-white/10
                                dark:bg-white/[0.03]
                            "
                        >

                            <div className="text-5xl">
                                {hasFilters
                                    ? "🔍"
                                    : "🎯"}
                            </div>

                            <h2
                                className="
                                    mt-5
                                    text-xl
                                    font-bold
                                    text-gray-900
                                    dark:text-white
                                "
                            >
                                {hasFilters
                                    ? "No matching goals"
                                    : "No financial goals found"}
                            </h2>

                            <p
                                className="
                                    mx-auto
                                    mt-2
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-gray-500
                                    dark:text-gray-400
                                "
                            >
                                {hasFilters
                                    ? "Try changing your search or filters to find another goal."
                                    : "Create your first financial goal and start building the future you want."}
                            </p>

                            {hasFilters ? (

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="
                                        mt-6
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                        shadow-sm
                                        transition
                                        hover:bg-gray-50
                                        dark:border-white/10
                                        dark:bg-white/5
                                        dark:text-gray-300
                                    "
                                >
                                    Clear Filters
                                </button>

                            ) : (

                                <button
                                    type="button"
                                    onClick={openCreateForm}
                                    className="
                                        mt-6
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
                                        hover:-translate-y-0.5
                                    "
                                >
                                    Create Your First Goal
                                </button>

                            )}

                        </div>

                    ) : (

                        <div
                            className="
                                grid
                                gap-5
                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {filteredGoals.map(
                                (goal) => (

                                    <GoalCard
                                        key={
                                            goal._id ||
                                            goal.id
                                        }
                                        goal={goal}

                                        onAddMoney={(
                                            selectedGoal
                                        ) =>
                                            setMoneyModal({
                                                goal: selectedGoal,
                                                mode: "add"
                                            })
                                        }

                                        onWithdraw={(
                                            selectedGoal
                                        ) =>
                                            setMoneyModal({
                                                goal: selectedGoal,
                                                mode: "withdraw"
                                            })
                                        }

                                        onEdit={
                                            openEditForm
                                        }

                                        onDelete={
                                            setDeleteGoalId
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

            {/* ==========================================
                CREATE / EDIT GOAL MODAL
            ========================================== */}

            {showForm && (

                <GoalForm
                    key={
                        editingGoal?._id ||
                        editingGoal?.id ||
                        "new-goal"
                    }

                    goal={editingGoal}

                    onSubmit={
                        handleGoalSubmit
                    }

                    onClose={
                        closeForm
                    }

                    loading={
                        actionLoading
                    }
                />

            )}

            {/* ==========================================
                ADD / WITHDRAW MONEY MODAL
            ========================================== */}

            {moneyModal && (

                <AddMoneyModal
                    key={
                        `${moneyModal.goal._id}-${moneyModal.mode}`
                    }

                    goal={
                        moneyModal.goal
                    }

                    mode={
                        moneyModal.mode
                    }

                    onClose={() =>
                        setMoneyModal(null)
                    }

                    onSubmit={
                        handleMoneySubmit
                    }

                    loading={
                        actionLoading
                    }
                />

            )}

            {/* ==========================================
                DELETE MODAL
            ========================================== */}

            {deleteGoalId && (

                <DeleteGoalModal
                    onClose={() =>
                        setDeleteGoalId(null)
                    }

                    onConfirm={
                        handleDelete
                    }

                    loading={
                        actionLoading
                    }
                />

            )}

        </div>
    );
};

export default FinancialGoals;