import express from "express";
import {
  adminLogin,
  adminLogout,
  adminProfile,
  addDoctor,
} from "../controllers/admin.controller.js";
import { isAdminAuthenticated } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

//Admin-Login
router.post("/login", adminLogin);

//Admin-Logout
router.get("/logout", isAdminAuthenticated, adminLogout);

//Admin-Profile
router.get("/profile", isAdminAuthenticated, adminProfile);

//Admin-Add Doctor
router.post(
  "/add-doctor",
  upload.single("image"),
  isAdminAuthenticated,
  addDoctor
);

export default router;
