import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
