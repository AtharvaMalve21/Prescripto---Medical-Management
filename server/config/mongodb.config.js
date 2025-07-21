import mongoose from "mongoose";

const connectMongoDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(
        `✅ Connected to Mongo Database. ${mongoose.connection.name} / ${mongoose.connection.host}`
      );
    })
    .catch((error) => {
      console.log(`❌Connection failed while connecting to Mongo Database. ${error.message}`);
      process.exit(1);
    });
};

export default connectMongoDB;
