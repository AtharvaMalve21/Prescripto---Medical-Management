import express from "express";
import {
  paymentRazorPay,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { isPatientAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", isPatientAuthenticated, paymentRazorPay);

router.post("/verify-payment", isPatientAuthenticated, verifyPayment);

export default router;
