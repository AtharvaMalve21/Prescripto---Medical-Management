import { razorpay } from "../utils/razorpay.utils.js";
import Appointment from "../models/appointment.model.js";
import { transporter } from "../config/nodemailer.config.js";
import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import { appointmentPaymentEmailTemplate } from "../utils/emailTemplate.js";

export const paymentRazorPay = async (req, res) => {
  try {
    
    //find the appointment
    const { id: appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment not found with the provided id.",
      });
    }

    //check for if the appointment is cancelled
    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is cancelled.",
      });
    }

    //check for if the appointment fee is already paid
    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Appointment fees is already paid",
      });
    }

    //generate options for payment
    const options = {
      amount: appointment.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("Razorpay Payment Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during Razorpay order creation.",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay Order ID is required.",
      });
    }

    const rzOrder = await razorpay.orders.fetch(razorpay_order_id);

    if (!rzOrder) {
      return res.status(404).json({
        success: false,
        message: "No order found with the provided Razorpay Order ID.",
      });
    }

    const { status: paymentStatus, receipt: appointmentId } = rzOrder;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Receipt (appointment ID) not found in Razorpay order.",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    const patient = await User.findById(appointment.patient);

    const doctor = await Doctor.findById(appointment.doctor);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found for the provided ID.",
      });
    }

    if (paymentStatus === "paid") {
      appointment.paymentStatus = "paid";
      await appointment.save();

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: patient.email,
        subject: `Payment Confirmation - Appointment with Dr. ${doctor.name}`,
        html: appointmentPaymentEmailTemplate(
          patient.name,
          doctor.name,
          appointment.slotDate,
          appointment.slotTime,
          doctor.address,
          appointment.amount,
          razorpay_order_id
        ),
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified and appointment marked as paid.",
        appointmentId: appointment._id,
        paymentStatus,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed. Status: " + paymentStatus,
      });
    }
  } catch (err) {
    console.error("Payment verification failed:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification.",
      error: err.message,
    });
  }
};
