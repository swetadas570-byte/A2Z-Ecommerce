import pool from "../config/db.js";


export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = `
            SELECT
                p.product_id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image_url,
                p.category_id,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c
                ON p.category_id = c.category_id
        `;

        const values = [];
        const conditions = [];

        if (search) {
            values.push(`%${search}%`);

            conditions.push(`
                (
                    p.name ILIKE $${values.length}
                    OR p.description ILIKE $${values.length}
                )
            `);
        }

        if (category) {
            values.push(category);

            conditions.push(
                `p.category_id = $${values.length}`
            );
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY p.created_at DESC";

        const result = await pool.query(query, values);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get products error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                p.product_id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image_url,
                p.category_id,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c
                ON p.category_id = c.category_id
            WHERE p.product_id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Get product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            image_url,
            category_id
        } = req.body;

        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({
                message: "Name, price and stock are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO products
            (name, description, price, stock, image_url, category_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                product_id,
                name,
                description,
                price,
                stock,
                image_url,
                category_id
            `,
            [
                name,
                description || null,
                price,
                stock,
                image_url || null,
                category_id || null
            ]
        );

        res.status(201).json({
            message: "Product created successfully",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Create product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            price,
            stock,
            image_url,
            category_id
        } = req.body;

        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({
                message: "Name, price and stock are required"
            });
        }

        const result = await pool.query(
            `
            UPDATE products
            SET
                name = $1,
                description = $2,
                price = $3,
                stock = $4,
                image_url = $5,
                category_id = $6
            WHERE product_id = $7
            RETURNING
                product_id,
                name,
                description,
                price,
                stock,
                image_url,
                category_id
            `,
            [
                name,
                description || null,
                price,
                stock,
                image_url || null,
                category_id || null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Update product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM products
            WHERE product_id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};