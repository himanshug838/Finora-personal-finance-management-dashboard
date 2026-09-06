import mongoose from "mongoose";

const connectDB = async () => {
  try {

    if (!process.env.MONGO_URL) {
      throw new Error(
        "MONGO_URL is missing from environment variables"
      );
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(
      process.env.MONGO_URL,
      {
        serverSelectionTimeoutMS: 5000,
      }
    );

    console.log(
      `MongoDB connected: ${mongoose.connection.host}`
    );

    console.log(
      `Database: ${mongoose.connection.name}`
    );

  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};


// Connection events

mongoose.connection.on(
  "disconnected",
  () => {
    console.warn(
      "MongoDB disconnected"
    );
  }
);

mongoose.connection.on(
  "reconnected",
  () => {
    console.log(
      "MongoDB reconnected"
    );
  }
);

mongoose.connection.on(
  "error",
  (error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  }
);

export default connectDB;