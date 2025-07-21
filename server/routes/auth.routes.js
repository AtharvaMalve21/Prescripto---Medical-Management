import express from "express";

import {
  registerPatient,
  loginPatient,
  logoutPatient,
  loginDoctor,
  logoutDoctor,
} from "../controllers/auth.controller.js";

import {
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middleware/auth.middleware.js";

const router = express.Router();

//Patient-Registration
router.post("/register-patient", registerPatient);

//Patient-Login
router.post("/login-patient", loginPatient);

//Patient-Logout
router.get("/logout-patient", isPatientAuthenticated, logoutPatient);

//Doctor-Login
router.post("/login-doctor", loginDoctor);

//Doctor-Logout
router.get("/logout-doctor", isDoctorAuthenticated, logoutDoctor);

export default router;
