import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/trim";
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};
