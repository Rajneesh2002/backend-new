import mongoose from "mongoose";

const url =
  "mongodb+srv://rajneeshasp29:rajneesh123@cluster0.5umti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connection Successful!!");
  } catch (error) {
    console.error("MongoDB Connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
