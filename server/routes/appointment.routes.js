import express from "express";
import {
  bookAppointment,
  myAppointments,
  viewAppointment,
  cancelAppointment,
} from "../controllers/appointment.controller.js";

import { isPatientAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/book/:id", isPatientAuthenticated, bookAppointment);

router.get("/", isPatientAuthenticated, myAppointments);

router.get("/:id", isPatientAuthenticated, viewAppointment);

router.delete("/cancel/:id", isPatientAuthenticated, cancelAppointment);

export default router;
