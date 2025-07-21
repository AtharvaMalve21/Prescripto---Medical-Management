import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, and password.",
      });
    }

    const existingPatient = await User.findOne({ email: email });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newPatient = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    //generate token
    const patientToken = jwt.sign(
      { _id: newPatient._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("patientToken", patientToken, cookieOptions);

    return res.status(201).json({
      success: true,
      data: newPatient,
      message: "Patient registered successfully. Welcome aboard!",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while registering the patient. Please try again later.",
    });
  }
};

export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password to log in.",
      });
    }

    const existingPatient = await User.findOne({ email: email });

    if (!existingPatient) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingPatient.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    const patientToken = jwt.sign(
      { _id: existingPatient._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("patientToken", patientToken, cookieOptions);

    return res.status(200).json({
      success: true,
      data: existingPatient,
      message: "Logged in successfully. Welcome back!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while logging in. Please try again later.",
    });
  }
};

export const logoutPatient = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("patientToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully. See you again soon!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to log out at the moment. Please try again.",
    });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password to log in.",
      });
    }

    const existingDoctor = await Doctor.findOne({ email: email });

    if (!existingDoctor) {
      return res.status(400).json({
        success: false,
        message:
          "No doctor account found with this email. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingDoctor.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }

    const doctorToken = jwt.sign(
      { _id: existingDoctor._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("doctorToken", doctorToken, cookieOptions);

    return res.status(200).json({
      success: true,
      data: existingDoctor,
      message: "Doctor logged in successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login failed due to a server error. Please try again shortly.",
    });
  }
};

export const logoutDoctor = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("doctorToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully. Thank you!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Logout failed. Please try again later.",
    });
  }
};

export const doctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
      message: "Doctor profile data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
