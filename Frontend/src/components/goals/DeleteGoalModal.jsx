const DeleteGoalModal = ({
    onClose,
    onConfirm,
    loading
}) => {

    return (
        <div
            className="
                fixed
                inset-0
                z-[120]
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
                    max-w-sm
                    rounded-3xl
                    border
                    border-white/20
                    bg-white/90
                    p-6
                    text-center
                    shadow-2xl
                    backdrop-blur-2xl
                    dark:border-white/10
                    dark:bg-gray-950/90
                "
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-500/10
                        text-2xl
                    "
                >
                    🗑️
                </div>

                <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                    Delete this goal?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    This goal will be cancelled and removed from your active goals.
                </p>

                <div className="mt-6 flex gap-3">

                    <button
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
                            text-gray-700
                            dark:border-white/10
                            dark:bg-white/5
                            dark:text-gray-300
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="
                            flex-1
                            rounded-2xl
                            bg-red-500
                            px-4
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-red-500/20
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete Goal"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default DeleteGoalModal;