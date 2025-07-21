import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import bcrypt, { hash } from "bcrypt";
import Doctor from "../models/doctor.model.js";
import fs from "fs";

export const adminLogin = async (req, res) => {
  try {
    
    //fetch admin details
    const { email, password } = req.body;

    //validate details
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password to log in.",
      });
    }

    //check email & password if matches with admin credentials
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid login credentials.",
      });
    }

    //generate token
    const adminToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("adminToken", adminToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const adminLogout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.clearCookie("adminToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const adminProfile = async (req, res) => {
  try {
    const adminEmail = req.admin;

    if (adminEmail !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access. Admin only.",
      });
    }

    return res.status(200).json({
      success: true,
      data: adminEmail,
      message: "Admin profile details found.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//add doctor logic
export const addDoctor = async (req, res) => {
  try {
    //fetch the doctor details
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    //validate the doctor details
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields.",
      });
    }

    const image = req.file?.path;

    if (!image) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor profile image is required. Please upload a valid image.",
      });
    }

    //check for existing doctor
    const existingDoctor = await Doctor.findOne({ email: email });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload the image on cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "prescripto/doctors",
    });

    fs.unlinkSync(image);

    const newDoctor = await Doctor.create({
      name: name,
      email: email,
      password: hashedPassword,
      image: cloudinaryResponse.secure_url,
      speciality: speciality,
      experience: experience,
      degree: degree,
      about: about,
      fees: fees,
      address: address,
      date: Date.now(),
    });

    return res.status(201).json({
      success: true,
      data: newDoctor,
      message: "Doctor profile created successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
