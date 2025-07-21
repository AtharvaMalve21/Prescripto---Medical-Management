import express from "express";
import {
  getAllDoctors,
  filterDoctorBySpeciality,
  viewDoctor,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/filter", filterDoctorBySpeciality);
router.get("/:id", viewDoctor);

export default router;
