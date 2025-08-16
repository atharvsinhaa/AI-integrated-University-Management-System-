import { Router } from "express";
import { getProfileDetails, updateProfileDetails } from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // Multer for file upload

const router = Router();

// Route 1: Get profile details (GET: /api/profile)
router.get("/getProfileDetails", verifyJWT, getProfileDetails);

// Route 2: Update profile details (PUT: /api/profile)
router.put("/updateProfileDetails", verifyJWT, upload.single("avatar"), updateProfileDetails);

export default router;