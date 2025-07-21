import express from "express";
import {
  adminLogin,
  adminLogout,
  adminProfile,
} from "../controllers/admin.controller.js";
import { isAdminAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

//Admin-Login
router.post("/login", adminLogin);

//Admin-Logout
router.get("/logout", isAdminAuthenticated, adminLogout);

//Admin-Profile
router.get("/profile", isAdminAuthenticated, adminProfile);

export default router;
