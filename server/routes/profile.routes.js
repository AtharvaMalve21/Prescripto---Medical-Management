import express from "express";
import {
  getPatientProfile,
  updatePatientProfile,
} from "../controllers/profile.controller.js";

import { isPatientAuthenticated } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

//GET- Patient Profile
router.get("/patient-profile", isPatientAuthenticated, getPatientProfile);

//PUT - Update Patient Profile
router.put(
  "/patient-profile",
  upload.single("image"),
  isPatientAuthenticated,
  updatePatientProfile
);

export default router;
