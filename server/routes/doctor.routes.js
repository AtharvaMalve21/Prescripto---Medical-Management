import express from "express";
import {
  getAllDoctors,
  getDoctorDashboard,
  filterDoctorBySpeciality,
  viewDoctor,
  approveAppointment,
  cancelAppointment,
  myAppointments,
} from "../controllers/doctor.controller.js";
import { isDoctorAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/dashboard", isDoctorAuthenticated, getDoctorDashboard);
router.get("/my-appointments", isDoctorAuthenticated, myAppointments);
router.get("/filter", filterDoctorBySpeciality);
router.get("/:id", viewDoctor);
router.get("/appointment/:id", isDoctorAuthenticated, approveAppointment);
router.delete("/appointment/:id", isDoctorAuthenticated, cancelAppointment);

export default router;
