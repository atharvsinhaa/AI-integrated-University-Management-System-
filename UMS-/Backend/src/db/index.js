import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`\n MONGO_DB CONNECTED!! \t DB_HOST: ${connectionInstance.connection.host}`); // learn about connectionInstance
  } catch (error) {
    console.log("MONGO_DB CONNECTION ERROR:", error);
    process.exit(1); // learn about exit codes hehe...
  }
};

export default connectDB;
