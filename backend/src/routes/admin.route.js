import express from "express";

import {
    getPendingUsers,
    approveUser,
    rejectUser
} from "../controllers/admin.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();


// Middleware to check admin
const adminOnly = (req, res, next) => {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!req.user || req.user.email !== adminEmail) {
        return res.status(403).json({
            message: "Admin access only"
        });
    }

    next();
};


// Get pending users
router.get(
    "/pending-users",
    protectRoute,
    adminOnly,
    getPendingUsers
);


// Approve user
router.put(
    "/approve/:userId",
    protectRoute,
    adminOnly,
    approveUser
);


// Reject user
router.put(
    "/reject/:userId",
    protectRoute,
    adminOnly,
    rejectUser
);


export default router;