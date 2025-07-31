import Doctor from "../models/doctor.model.js";
import Appointment from "../models/appointment.model.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ available: true }).sort({
      createdAt: -1,
    });

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

    const filteredDoctors = await Doctor.find({
      speciality: speciality,
      available: true,
    });

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

export const myAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    //find the appointments
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate({
        path: "patient",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("doctor");

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

export const cancelAppointment = async (req, res) => {
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

export const getDoctorDashboard = async (req, res) => {
  try {

    const doctorId = req.doctor.doctorId;

    // Get all appointments for this doctor
    const appointments = await Appointment.find({ doctorId })
      .populate("patient", "name email additionalDetails")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const stats = {
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter((apt) => !apt.isCompleted).length,
      completedAppointments: appointments.filter((apt) => apt.isCompleted)
        .length,
      todayAppointments: appointments.filter((apt) => {
        const aptDate = new Date(apt.slotDate);
        return aptDate >= todayStart && aptDate < todayEnd;
      }).length,
      totalEarnings: appointments
        .filter((apt) => apt.isCompleted && apt.paymentStatus === "paid")
        .reduce((sum, apt) => sum + apt.amount, 0),
      thisWeekAppointments: appointments.filter((apt) => {
        const aptDate = new Date(apt.slotDate);
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return aptDate >= weekStart;
      }).length,
      thisMonthAppointments: appointments.filter((apt) => {
        const aptDate = new Date(apt.slotDate);
        return (
          aptDate.getMonth() === now.getMonth() &&
          aptDate.getFullYear() === now.getFullYear()
        );
      }).length,
    };

    // Get recent appointments (last 5)
    const recentAppointments = appointments.slice(0, 5);

    // Get today's appointments
    const todayAppointments = appointments
      .filter((apt) => {
        const aptDate = new Date(apt.slotDate);
        return aptDate >= todayStart && aptDate < todayEnd;
      })
      .sort((a, b) => {
        // Sort by time
        const timeA = a.slotTime.split(":").map(Number);
        const timeB = b.slotTime.split(":").map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });

    res.status(200).json({
      success: true,
      data: {
        appointments,
        recentAppointments,
        todayAppointments,
        stats,
      },
    });
  } catch (error) {
    console.error("Get doctor dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

