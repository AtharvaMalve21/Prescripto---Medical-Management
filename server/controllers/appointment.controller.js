import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Appointment from "../models/appointment.model.js";
import { transporter } from "../config/nodemailer.config.js";
import { appointmentBookedEmailTemplate } from "../utils/emailTemplate.js";

export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.patient._id;
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient is not authenticated.",
      });
    }

    const { id: doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.available) {
      return res.status(400).json({
        success: false,
        message: !doctor ? "Doctor not found." : "Doctor is not available.",
      });
    }

    const { slotDate, slotTime } = req.body;

    if (!slotDate || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide both date and time for the slot.",
      });
    }

    // const existingAppointment = await Appointment.findOne({
    //   doctor: doctorId,
    //   patient: patientId,
    //   isCompleted: false,
    // });

    // if (existingAppointment) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You already have an ongoing appointment with this doctor.",
    //   });
    // }

    const updateResult = await Doctor.findOneAndUpdate(
      {
        _id: doctorId,
        $or: [
          { [`slots_booked.${slotDate}`]: { $ne: slotTime } },
          { [`slots_booked.${slotDate}`]: { $exists: false } },
        ],
      },
      {
        $push: { [`slots_booked.${slotDate}`]: slotTime },
      },
      { new: true }
    );

    if (!updateResult) {
      return res.status(400).json({
        success: false,
        message: "Selected slot is already booked. Please choose another one.",
      });
    }

    const newAppointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      amount: doctor.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: patient.email,
      subject: `Hi ${patient.name}, Your Appointment Has Been Confirmed!`,
      html: appointmentBookedEmailTemplate(
        patient.name,
        doctor.name,
        slotDate,
        slotTime,
        doctor.address
      ),
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      data: newAppointment,
    });
  } catch (err) {
    console.error("Error booking appointment:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while booking the appointment.",
    });
  }
};

export const myAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.patient._id,
    })
      .populate("patient doctor")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: appointments,
      message: "Appointments data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const viewAppointment = async (req, res) => {
  try {
    const { id: appointmentId } = req.params;

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: req.patient._id,
    }).populate("patient doctor");

    return res.status(200).json({
      success: true,
      data: appointment,
      message: "Appointment data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    //authenticate patient
    const patient = await User.findById(req.patient._id);
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient is not authenticated. Login to cancel the booking.",
      });
    }

    //find the appointment
    const { id: appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment not found with the provided id.",
      });
    }

    //check if the user is authorized to cancel appointment
    if (appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel the appointment.",
      });
    }

    //update the appointment status
    await Appointment.findByIdAndUpdate(appointmentId, {
      status: "cancelled",
    });

    //update the doctor model
    const doctor = await Doctor.findById(appointment.doctor);

    let slots_booked = doctor.slots_booked;

    slots_booked[appointment.slotDate] = slots_booked[
      appointment.slotDate
    ].filter((e) => e !== appointment.slotTime);

    await Doctor.findByIdAndUpdate(doctor._id, {
      slots_booked: slots_booked,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
