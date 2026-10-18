import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";

import {
    authenticateUser
} from "../middleware/authMiddleware.js";

import {
    authorizeAdmin
} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", 
    authenticateUser,
    authorizeAdmin,
    createCategory);

router.put(
    "/:id",
    authenticateUser,
    authorizeAdmin,
    updateCategory
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeAdmin,
    deleteCategory
);

export default router;