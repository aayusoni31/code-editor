import * as mongoose from "mongoose";
export const connectToDatabase = async () => {
  const DB_URL = process.env.DB_URL || "mongodb://localhost:27017";
  try {
    await mongoose.connect(DB_URL, {
      // Forces Mongoose to save data inside a database specifically named "interview", preventing it from accidentally saving to a default test database.
      dbName: "interview",
      bufferCommands: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.log("Mongo connection error", err);
  }
};
