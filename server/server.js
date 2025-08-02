import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectMongoDB from "./config/mongodb.config.js";
import connectCloudinary from "./config/cloudinary.config.js";


//route handlers
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

//middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: [process.env.CLIENT_URI, process.env.ADMIN_URI],
    credentials: true,
  })
);
app.use(cookieParser());

//connect to mongo database
connectMongoDB();

//connect to cloudinary
connectCloudinary();

//route handlers
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Prescripto Application." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening to port ${PORT}`);
});
