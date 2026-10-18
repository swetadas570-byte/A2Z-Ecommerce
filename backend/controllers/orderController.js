import pool from "../config/db.js";

export const createOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const userId = req.user.userId;
        const { shipping_address } = req.body;

        if (!shipping_address) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        await client.query("BEGIN");

        const cartResult = await client.query(
            `
            SELECT
                c.cart_item_id,
                c.product_id,
                c.quantity,
                p.name,
                p.price,
                p.stock
            FROM cart_items c
            JOIN products p
                ON c.product_id = p.product_id
            WHERE c.user_id = $1
            FOR UPDATE
            `,
            [userId]
        );

        if (cartResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const cartItems = cartResult.rows;

        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                await client.query("ROLLBACK");

                return res.status(400).json({
                    message: `Insufficient stock for ${item.name}`
                });
            }
        }

        let totalAmount = 0;

        for (const item of cartItems) {
            totalAmount +=
                Number(item.price) * item.quantity;
        }

        const orderResult = await client.query(
            `
            INSERT INTO orders
            (user_id, total_amount, status, shipping_address)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                userId,
                totalAmount,
                "Pending",
                shipping_address
            ]
        );

        const order = orderResult.rows[0];

        for (const item of cartItems) {

            await client.query(
                `
                INSERT INTO order_items
                (order_id, product_id, product_name, quantity, price)
                VALUES ($1, $2, $3, $4, $5)
                `,
                [
                    order.order_id,
                    item.product_id,
                    item.name,
                    item.quantity,
                    item.price
                ]
            );

            await client.query(
                `
                UPDATE products
                SET stock = stock - $1
                WHERE product_id = $2
                `,
                [
                    item.quantity,
                    item.product_id
                ]
            );
        }

        await client.query(
            `
            DELETE FROM cart_items
            WHERE user_id = $1
            `,
            [userId]
        );

        await client.query("COMMIT");

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Create order error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });

    } finally {
        client.release();
    }
};

//Order History
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `
            SELECT
                o.order_id,
                o.total_amount,
                o.status,
                o.shipping_address,
                o.created_at,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'product_id', oi.product_id,
                            'product_name', oi.product_name,
                            'quantity', oi.quantity,
                            'price', oi.price,
                            'subtotal', oi.quantity * oi.price
                        )
                    ) FILTER (WHERE oi.order_item_id IS NOT NULL),
                    '[]'
                ) AS items
            FROM orders o
            LEFT JOIN order_items oi
                ON o.order_id = oi.order_id
            WHERE o.user_id = $1
            GROUP BY o.order_id
            ORDER BY o.created_at DESC
            `,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get orders error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                o.order_id,
                o.total_amount,
                o.status,
                o.shipping_address,
                o.created_at,
                u.user_id,
                u.name AS customer_name,
                u.email AS customer_email,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'product_id', oi.product_id,
                            'product_name', oi.product_name,
                            'quantity', oi.quantity,
                            'price', oi.price,
                            'subtotal', oi.quantity * oi.price
                        )
                    ) FILTER (WHERE oi.order_item_id IS NOT NULL),
                    '[]'
                ) AS items
            FROM orders o
            JOIN users u
                ON o.user_id = u.user_id
            LEFT JOIN order_items oi
                ON o.order_id = oi.order_id
            GROUP BY o.order_id, u.user_id
            ORDER BY o.created_at DESC
            `
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get all orders error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const result = await pool.query(
            `
            UPDATE orders
            SET status = $1
            WHERE order_id = $2
            RETURNING *
            `,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Update order status error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};