import { useState } from "react";

const AddMoneyModal = ({
    goal,
    mode = "add",
    onClose,
    onSubmit,
    loading
}) => {

    const [amount, setAmount] =
        useState("");

    const [error, setError] =
        useState("");

    const isAdd =
        mode === "add";

    const maxAmount =
        isAdd
            ? Math.max(
                Number(goal.targetAmount) -
                Number(goal.currentAmount),
                0
            )
            : Number(goal.currentAmount);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const numericAmount =
            Number(amount);

        if (
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            setError(
                "Please enter a valid amount."
            );
            return;
        }

        if (
            numericAmount > maxAmount
        ) {
            setError(
                isAdd
                    ? `You can add a maximum of ₹${maxAmount.toLocaleString("en-IN")}.`
                    : `You can withdraw a maximum of ₹${maxAmount.toLocaleString("en-IN")}.`
            );
            return;
        }

        try {

            await onSubmit(
                numericAmount
            );

        } catch (err) {

            setError(
                err.message ||
                "Something went wrong."
            );
        }
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[110]
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
                    w-full
                    max-w-md
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

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                            {isAdd
                                ? "Increase Savings"
                                : "Withdraw Savings"}
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                            {goal.name}
                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-full
                            bg-gray-100
                            text-gray-500
                            dark:bg-white/10
                        "
                    >
                        ✕
                    </button>

                </div>

                {/* Current amount */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-blue-500/10
                        bg-blue-500/5
                        p-4
                    "
                >

                    <div className="flex justify-between">

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Current savings
                        </span>

                        <span className="font-bold text-gray-900 dark:text-white">
                            ₹{Number(goal.currentAmount || 0).toLocaleString("en-IN")}
                        </span>

                    </div>

                    {isAdd && (

                        <div className="mt-2 flex justify-between">

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Remaining to target
                            </span>

                            <span className="font-semibold text-blue-500">
                                ₹{maxAmount.toLocaleString("en-IN")}
                            </span>

                        </div>

                    )}

                </div>

                {error && (

                    <div
                        className="
                            mt-4
                            rounded-2xl
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
                    className="mt-5"
                >

                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount
                    </label>

                    <div className="relative">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            ₹
                        </span>

                        <input
                            type="number"
                            min="1"
                            max={maxAmount}
                            value={amount}
                            onChange={(event) =>
                                setAmount(event.target.value)
                            }
                            placeholder="Enter amount"
                            autoFocus
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-gray-200
                                bg-gray-50
                                py-4
                                pl-9
                                pr-4
                                text-lg
                                font-semibold
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-white
                            "
                        />

                    </div>

                    <div className="mt-5 flex gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex-1
                                rounded-2xl
                                border
                                border-gray-200
                                bg-gray-100
                                px-4
                                py-3
                                text-sm
                                font-semibold
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
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-blue-500/20
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Processing..."
                                : isAdd
                                    ? "Add Money"
                                    : "Withdraw"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddMoneyModal;