import pool from "../config/db.js";

export const getCategories = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT category_id, name
             FROM categories
             ORDER BY name ASC`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get categories error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await pool.query(
            `SELECT category_id
             FROM categories
             WHERE LOWER(name) = LOWER($1)`,
            [name]
        );

        if (existingCategory.rows.length > 0) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO categories (name)
             VALUES ($1)
             RETURNING category_id, name`,
            [name]
        );

        res.status(201).json({
            message: "Category created successfully",
            category: result.rows[0]
        });

    } catch (error) {
        console.error("Create category error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await pool.query(
            `
            SELECT category_id
            FROM categories
            WHERE LOWER(name) = LOWER($1)
            AND category_id != $2
            `,
            [name, id]
        );

        if (existingCategory.rows.length > 0) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        const result = await pool.query(
            `
            UPDATE categories
            SET name = $1
            WHERE category_id = $2
            RETURNING category_id, name
            `,
            [name, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category updated successfully",
            category: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Update category error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM categories
            WHERE category_id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete category error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};