import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/orders/admin"
            );

            setOrders(response.data);

        } catch (error) {
            console.error(
                "Error fetching admin orders:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Could not load orders"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (
        orderId,
        newStatus
    ) => {
        try {
            setMessage("");
            setError("");

            const response = await api.put(
                `/orders/admin/${orderId}`,
                {
                    status: newStatus
                }
            );

            setMessage(response.data.message);

            await fetchOrders();

        } catch (error) {
            console.error(
                "Update order status error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Could not update order status"
            );
        }
    };

    const getStatusClass = (status) => {
        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    if (loading) {
        return (
            <div className="admin-orders-message-page">
                <p>
                    Loading orders...
                </p>
            </div>
        );
    }

    if (error && orders.length === 0) {
        return (
            <div className="admin-orders-message-page admin-orders-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-orders-page">

            <div className="admin-orders-container">

                <div className="admin-orders-header">

                    <p className="admin-orders-small-title">
                        ADMINISTRATION
                    </p>

                    <h1>
                        Order Management
                    </h1>

                    <p>
                        View customer orders and manage
                        their current status.
                    </p>

                </div>


                {message && (
                    <div className="admin-orders-success-message">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="admin-orders-error-message">
                        {error}
                    </div>
                )}


                {orders.length === 0 ? (

                    <div className="no-admin-orders">

                        <div className="no-admin-orders-icon">
                            📦
                        </div>

                        <h2>
                            No Orders Yet
                        </h2>

                        <p>
                            Customer orders will appear
                            here once they are placed.
                        </p>

                    </div>

                ) : (

                    <div className="admin-orders-list">

                        {orders.map((order) => (

                            <article
                                className="admin-order-card"
                                key={order.order_id}
                            >

                                <div className="admin-order-card-header">

                                    <div>

                                        <p className="admin-order-label">
                                            ORDER
                                        </p>

                                        <h2>
                                            #{order.order_id}
                                        </h2>

                                    </div>


                                    <div className="admin-order-status-control">

                                        <label
                                            htmlFor={`status-${order.order_id}`}
                                        >
                                            Status
                                        </label>

                                        <select
                                            id={`status-${order.order_id}`}
                                            value={order.status}
                                            onChange={(event) =>
                                                handleStatusChange(
                                                    order.order_id,
                                                    event.target.value
                                                )
                                            }
                                            className={`status-select ${getStatusClass(
                                                order.status
                                            )}`}
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Processing">
                                                Processing
                                            </option>

                                            <option value="Shipped">
                                                Shipped
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>

                                        </select>

                                    </div>

                                </div>


                                <div className="admin-order-customer">

                                    <div className="admin-order-section-heading">
                                        <h3>
                                            Customer Information
                                        </h3>
                                    </div>


                                    <div className="admin-customer-grid">

                                        <div className="admin-customer-item">

                                            <span>
                                                Name
                                            </span>

                                            <strong>
                                                {order.customer_name}
                                            </strong>

                                        </div>


                                        <div className="admin-customer-item">

                                            <span>
                                                Email
                                            </span>

                                            <strong>
                                                {order.customer_email}
                                            </strong>

                                        </div>


                                        <div className="admin-customer-item">

                                            <span>
                                                Order Date
                                            </span>

                                            <strong>
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                </div>


                                <div className="admin-order-shipping">

                                    <div className="admin-order-section-heading">
                                        <h3>
                                            Shipping Address
                                        </h3>
                                    </div>

                                    <p>
                                        {order.shipping_address}
                                    </p>

                                </div>


                                <div className="admin-order-products">

                                    <div className="admin-order-section-heading">

                                        <h3>
                                            Ordered Products
                                        </h3>

                                        <span>
                                            {order.items.length}{" "}
                                            {order.items.length === 1
                                                ? "item"
                                                : "items"}
                                        </span>

                                    </div>


                                    <div className="admin-order-products-list">

                                        {order.items.map(
                                            (item) => (

                                                <div
                                                    className="admin-order-product"
                                                    key={
                                                        item.order_item_id
                                                    }
                                                >

                                                    <div className="admin-order-product-info">

                                                        <h4>
                                                            {
                                                                item.product_name
                                                            }
                                                        </h4>

                                                        <p>
                                                            ₹
                                                            {Number(
                                                                item.price
                                                            ).toFixed(
                                                                2
                                                            )}
                                                            {" "}×{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                    </div>


                                                    <strong>
                                                        ₹
                                                        {(
                                                            Number(
                                                                item.price
                                                            ) *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>


                                <div className="admin-order-footer">

                                    <span>
                                        Order Total
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.total_amount
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminOrders;