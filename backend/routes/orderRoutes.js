import express from "express";

import {
    createOrder,
    getAllOrders,
    getMyOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

import {
    authenticateUser
} from "../middleware/authMiddleware.js";

import {
    authorizeAdmin
} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authenticateUser,
    createOrder
);

router.get(
    "/",
    authenticateUser,
    getMyOrders
);

router.get(
    "/admin",
    authenticateUser,
    authorizeAdmin,
    getAllOrders
);

router.put(
    "/admin/:id",
    authenticateUser,
    authorizeAdmin,
    updateOrderStatus
);

export default router;