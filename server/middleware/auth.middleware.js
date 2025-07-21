import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isPatientAuthenticated = async (req, res, next) => {
  try {
    const { patientToken } = req.cookies;
    if (!patientToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in to continue.",
      });
    }

    const decodedToken = jwt.verify(patientToken, process.env.JWT_SECRET);

    const patient = await User.findById(decodedToken._id);
    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in with a valid account.",
      });
    }
    req.patient = patient;
    next();
  } catch (err) {
    console.error("Patient Auth Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const isDoctorAuthenticated = async (req, res, next) => {
  try {
    const { doctorToken } = req.cookies;
    if (!doctorToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in to continue.",
      });
    }

    const decodedToken = jwt.verify(doctorToken, process.env.JWT_SECRET);

    const doctor = await Doctor.findById(decodedToken._id);
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found. Please log in with a valid account.",
      });
    }
    req.doctor = doctor;
    next();
  } catch (err) {
    console.error("Doctor Auth Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const isAdminAuthenticated = async (req, res, next) => {
  try {
    const { adminToken } = req.cookies;
    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing. Please log in to continue.",
      });
    }

    const decodedToken = jwt.verify(adminToken, process.env.JWT_SECRET);
    req.admin = decodedToken.email;
    next();
  } catch (err) {
    console.error("Admin Auth Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
