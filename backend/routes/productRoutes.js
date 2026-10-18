import express from "express";

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

import {
    authenticateUser
} from "../middleware/authMiddleware.js";

import {
    authorizeAdmin
} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
    "/",
    authenticateUser,
    authorizeAdmin,
    createProduct
);

router.put(
    "/:id",
    authenticateUser,
    authorizeAdmin,
    updateProduct
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeAdmin,
    deleteProduct
);

export default router;