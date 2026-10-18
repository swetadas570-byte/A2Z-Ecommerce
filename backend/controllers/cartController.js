import pool from "../config/db.js";

export const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `
            SELECT
                c.cart_item_id,
                c.product_id,
                c.quantity,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image_url,
                (p.price * c.quantity) AS subtotal
            FROM cart_items c
            JOIN products p
                ON c.product_id = p.product_id
            WHERE c.user_id = $1
            ORDER BY c.cart_item_id DESC
            `,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get cart error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { product_id, quantity } = req.body;

        if (!product_id) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        const requestedQuantity = quantity || 1;

        const productResult = await pool.query(
            `
            SELECT product_id, stock
            FROM products
            WHERE product_id = $1
            `,
            [product_id]
        );

        if (productResult.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const product = productResult.rows[0];

        if (requestedQuantity > product.stock) {
            return res.status(400).json({
                message: "Requested quantity exceeds available stock"
            });
        }

        const existingItem = await pool.query(
            `
            SELECT cart_item_id, quantity
            FROM cart_items
            WHERE user_id = $1
            AND product_id = $2
            `,
            [userId, product_id]
        );

        if (existingItem.rows.length > 0) {

            const newQuantity =
                existingItem.rows[0].quantity + requestedQuantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Quantity exceeds available stock"
                });
            }

            const result = await pool.query(
                `
                UPDATE cart_items
                SET quantity = $1
                WHERE cart_item_id = $2
                RETURNING *
                `,
                [newQuantity, existingItem.rows[0].cart_item_id]
            );

            return res.status(200).json({
                message: "Cart quantity updated",
                cartItem: result.rows[0]
            });
        }

        const result = await pool.query(
            `
            INSERT INTO cart_items
            (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [userId, product_id, requestedQuantity]
        );

        res.status(201).json({
            message: "Product added to cart",
            cartItem: result.rows[0]
        });

    } catch (error) {
        console.error("Add to cart error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const cartItemResult = await pool.query(
            `
            SELECT product_id
            FROM cart_items
            WHERE cart_item_id = $1
            AND user_id = $2
            `,
            [id, userId]
        );

        if (cartItemResult.rows.length === 0) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        const productId =
            cartItemResult.rows[0].product_id;

        const productResult = await pool.query(
            `
            SELECT stock
            FROM products
            WHERE product_id = $1
            `,
            [productId]
        );

        if (productResult.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const availableStock =
            productResult.rows[0].stock;

        if (quantity > availableStock) {
            return res.status(400).json({
                message:
                    "Quantity exceeds available stock"
            });
        }

        const result = await pool.query(
            `
            UPDATE cart_items
            SET quantity = $1
            WHERE cart_item_id = $2
            AND user_id = $3
            RETURNING *
            `,
            [quantity, id, userId]
        );

        res.status(200).json({
            message: "Cart item updated",
            cartItem: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Update cart error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM cart_items
            WHERE cart_item_id = $1
            AND user_id = $2
            RETURNING *
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        res.status(200).json({
            message: "Product removed from cart"
        });

    } catch (error) {
        console.error("Remove from cart error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


export const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        await pool.query(
            `
            DELETE FROM cart_items
            WHERE user_id = $1
            `,
            [userId]
        );

        res.status(200).json({
            message: "Cart cleared successfully"
        });

    } catch (error) {
        console.error("Clear cart error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};