import Doctor from "../models/doctor.model.js";
import Appointment from "../models/appointment.model.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: doctors,
      message: "Doctor data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const filterDoctorBySpeciality = async (req, res) => {
  try {
    const { speciality } = req.query;
    if (!speciality) {
      return res.status(400).json({
        success: false,
        message: "Speciality query parameter is required.",
      });
    }

    const filteredDoctors = await Doctor.find({ speciality: speciality });

    return res.status(200).json({
      success: true,
      data: filteredDoctors,
      message: "Doctors filtered by speciality",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const viewDoctor = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor not found with the given id.",
      });
    }
    return res.status(200).json({
      success: true,
      data: doctor,
      message: "Doctor data fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const approveAppointment = async (req, res) => {
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

    if (appointment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Appointment status is already approved.",
      });
    }

    if (appointment.paymentStatus === "unpaid") {
      return res.status(400).json({
        success: false,
        message: "Payment is not completed.",
      });
    }

    //optional check the doctor who is assigned can only update the appointment
    if (appointment.doctor.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to approve this appointment.",
      });
    }

    appointment.isCompleted = true;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
