import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response = await api.get(
                    "/orders"
                );

                setOrders(response.data);

            } catch (error) {

                console.error(
                    "Error fetching orders:",
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

        fetchOrders();

    }, []);


    if (loading) {

        return (
            <div className="orders-message-page">
                <p>
                    Loading your orders...
                </p>
            </div>
        );

    }


    if (error) {

        return (
            <div className="orders-message-page orders-error">
                <p>
                    {error}
                </p>
            </div>
        );

    }


    if (orders.length === 0) {

        return (
            <div className="empty-orders-page">

                <div className="empty-orders-icon">
                    📦
                </div>

                <h1>
                    No Orders Yet
                </h1>

                <p>
                    You haven't placed any orders yet.
                    Start shopping and your orders
                    will appear here.
                </p>

                <Link 
                to="/products" 
                className="start-shopping-button"
                > 
                Start Shopping 
                </Link>  

            </div>
        );

    }


    return (
        <div className="orders-page">

            <div className="orders-container">


                <div className="orders-header">

                    <p className="orders-small-title">
                        ORDER HISTORY
                    </p>

                    <h1>
                        Your Orders
                    </h1>

                    <p>
                        View your previous purchases
                        and order details.
                    </p>

                </div>


                <div className="orders-list">

                    {orders.map((order) => (

                        <article
                            className="order-card"
                            key={order.order_id}
                        >


                            <div className="order-card-header">

                                <div>

                                    <p className="order-label">
                                        ORDER
                                    </p>

                                    <h2>
                                        #{order.order_id}
                                    </h2>

                                </div>


                                <div className="order-status">

                                    <span>
                                        {order.status}
                                    </span>

                                </div>

                            </div>


                            <div className="order-info-grid">

                                <div className="order-info-item">

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


                                <div className="order-info-item">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.total_amount
                                        ).toFixed(2)}
                                    </strong>

                                </div>


                                <div className="order-info-item">

                                    <span>
                                        Shipping Address
                                    </span>

                                    <strong>
                                        {
                                            order.shipping_address
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="order-products">

                                <h3>
                                    Products
                                </h3>


                                <div className="order-products-list">

                                    {order.items.map(
                                        (item) => (

                                            <div
                                                className="order-product"
                                                key={
                                                    item.order_item_id
                                                }
                                            >

                                                <div className="order-product-info">

                                                    <h4>
                                                        {
                                                            item.product_name
                                                        }
                                                    </h4>

                                                    <p>
                                                        ₹
                                                        {Number(
                                                            item.price
                                                        ).toFixed(2)}
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


                            <div className="order-card-footer">

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

            </div>

        </div>
    );
}

export default Orders;