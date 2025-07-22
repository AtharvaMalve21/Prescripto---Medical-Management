import express from "express";
import {
  getAllDoctors,
  filterDoctorBySpeciality,
  viewDoctor,
  approveAppointment,
} from "../controllers/doctor.controller.js";
import { isDoctorAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/filter", filterDoctorBySpeciality);
router.get("/:id", viewDoctor);
router.get("/appointment/:id", isDoctorAuthenticated, approveAppointment);

export default router;
