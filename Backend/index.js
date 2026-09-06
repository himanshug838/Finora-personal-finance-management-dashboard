import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import app from "./src/app.js";
import {startRecurringTransactionJob} from "./jobs/recurringTransaction.job.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    startRecurringTransactionJob();
    console.log(`API Docs: http://localhost:${PORT}/api-docs`);
  });
}).catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error
        );

        process.exit(1);
    });