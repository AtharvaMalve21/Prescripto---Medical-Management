import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await User.findById(req.patient._id).populate(
      "additionalDetails"
    );
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // if (!patient.additionalDetails) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Patient profile not found. Please complete your profile.",
    //   });
    // }

    return res.status(200).json({
      success: true,
      data: patient,
      message: "Patient profile details fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    const patient = await User.findById(req.patient._id);
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Patient not found.",
      });
    }

    const { name, email, gender, phone, address, dob } = req.body;
    const image = req.file?.path;
    let cloudinaryResponse;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "prescripto/patients",
      });
      if (fs.existsSync(image)) fs.unlinkSync(image);
    }

    if (phone && phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be of 10 digits.",
      });
    }

    if (patient.additionalDetails) {
      // Update existing profile
      const profile = await Profile.findById(patient.additionalDetails);

      patient.name = name || patient.name;
      patient.email = email || patient.email;

      profile.gender = gender || profile.gender;
      profile.phone = phone || profile.phone;
      profile.address = address || profile.address;
      profile.dob = dob || profile.dob;
      profile.image = cloudinaryResponse?.secure_url || profile.image;

      await profile.save();
      await patient.save();

      return res.status(200).json({
        success: true,
        data: profile,
        message: "Profile updated successfully.",
      });
    } else {
      // Create new profile
      const newProfile = await Profile.create({
        gender,
        phone,
        address,
        dob,
        image: cloudinaryResponse?.secure_url || "", // fallback in case upload fails
      });

      patient.name = name || patient.name;
      patient.email = email || patient.email;
      patient.additionalDetails = newProfile._id;

      await patient.save();

      return res.status(200).json({
        success: true,
        data: newProfile,
        message: "Profile created successfully.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
