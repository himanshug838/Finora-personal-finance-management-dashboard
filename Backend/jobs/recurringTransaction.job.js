import cron from "node-cron";

import {
    processDueRecurringTransactions
} from "../services/recurringTransaction.service.js";


// ==========================================
// RECURRING TRANSACTION CRON JOB
// ==========================================

export const startRecurringTransactionJob =
    () => {

        cron.schedule(
            "* * * * *",
            async () => {

                try {

                    const result =
                        await processDueRecurringTransactions();

                    if (
                        result.processed > 0 ||
                        result.failed > 0
                    ) {

                        console.log(
                            `[Recurring Transactions] Processed: ${result.processed}, Failed: ${result.failed}`
                        );
                    }

                } catch (error) {

                    console.error(
                        "[Recurring Transactions] Job failed:",
                        error.message
                    );
                }
            },
            {
                name:
                    "finora-recurring-transactions",

                noOverlap:
                    true
            }
        );

        console.log(
            "Recurring transaction scheduler started."
        );
    };