import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Cart.css";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/cart");

            setCartItems(response.data);

        } catch (error) {
            console.error(
                "Error fetching cart:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Could not load cart"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (
        cartItemId,
        quantity
    ) => {
        if (quantity < 1) {
            return;
        }

        try {
            setMessage("");

            const response = await api.put(
                `/cart/${cartItemId}`,
                {
                    quantity: quantity
                }
            );

            setMessage(response.data.message);

            await fetchCart();

        } catch (error) {
            console.error(
                "Update cart error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not update cart"
            );
        }
    };

    const handleRemove = async (cartItemId) => {
        try {
            setMessage("");

            const response = await api.delete(
                `/cart/${cartItemId}`
            );

            setMessage(response.data.message);

            await fetchCart();

        } catch (error) {
            console.error(
                "Remove cart item error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not remove item"
            );
        }
    };

    const handleClearCart = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to clear your cart?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");

            const response = await api.delete(
                "/cart"
            );

            setMessage(response.data.message);

            await fetchCart();

        } catch (error) {
            console.error(
                "Clear cart error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not clear cart"
            );
        }
    };

    const totalAmount = cartItems.reduce(
        (total, item) => {
            return total + Number(item.subtotal);
        },
        0
    );

    if (loading) {
        return (
            <div className="cart-message-page">
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-message-page cart-error">
                <p>{error}</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-page">

                <div className="empty-cart-icon">
                    🛒
                </div>

                <h1>
                    Your Cart is Empty
                </h1>

                <p>
                    Looks like you haven't added
                    anything to your cart yet.
                </p>

                <Link
                    to="/products"
                    className="continue-shopping-button"
                >
                    Continue Shopping
                </Link>

            </div>
        );
    }

    return (
        <div className="cart-page">

            <div className="cart-container">

                <div className="cart-header">

                    <p className="cart-small-title">
                        SHOPPING CART
                    </p>

                    <h1>
                        Your Cart
                    </h1>

                    <p>
                        Review your selected products
                        before checkout.
                    </p>

                </div>


                {message && (
                    <div className="cart-message">
                        {message}
                    </div>
                )}


                <div className="cart-layout">

                    <section className="cart-items-section">

                        <div className="cart-items-header">
                            <h2>
                                Cart Items
                            </h2>

                            <button
                                type="button"
                                className="clear-cart-button"
                                onClick={
                                    handleClearCart
                                }
                            >
                                Clear Cart
                            </button>
                        </div>


                        <div className="cart-items">

                            {cartItems.map((item) => (

                                <article
                                    className="cart-item"
                                    key={item.cart_item_id}
                                >

                                    <div className="cart-item-image">

                                        {item.image_url ? (
                                            <img
                                                src={
                                                    item.image_url
                                                }
                                                alt={
                                                    item.name
                                                }
                                            />
                                        ) : (
                                            <span>
                                                No image
                                            </span>
                                        )}

                                    </div>


                                    <div className="cart-item-details">

                                        <h3>
                                            {item.name}
                                        </h3>

                                        <p className="cart-item-price">
                                            ₹
                                            {Number(
                                                item.price
                                            ).toFixed(2)}
                                        </p>

                                        <p className="cart-item-stock">
                                            {item.stock > 0
                                                ? `${item.stock} available`
                                                : "Out of stock"}
                                        </p>


                                        <div className="cart-item-actions">

                                            <div className="cart-quantity">

                                                <button
                                                    type="button"
                                                    disabled={
                                                        item.quantity <=
                                                        1
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.cart_item_id,
                                                            item.quantity -
                                                                1
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        item.quantity >=
                                                        item.stock
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.cart_item_id,
                                                            item.quantity +
                                                                1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>


                                            <button
                                                type="button"
                                                className="remove-item-button"
                                                onClick={() =>
                                                    handleRemove(
                                                        item.cart_item_id
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>


                                    <div className="cart-item-subtotal">

                                        <span>
                                            Subtotal
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                item.subtotal
                                            ).toFixed(2)}
                                        </strong>

                                    </div>

                                </article>

                            ))}

                        </div>

                    </section>


                    <aside className="cart-summary">

                        <h2>
                            Order Summary
                        </h2>

                        <div className="summary-row">

                            <span>
                                Items
                            </span>

                            <span>
                                {cartItems.length}
                            </span>

                        </div>

                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹
                                {totalAmount.toFixed(2)}
                            </span>

                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {totalAmount.toFixed(2)}
                            </strong>

                        </div>

                        <Link
                            to="/checkout"
                            className="checkout-button"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link
                            to="/products"
                            className="continue-shopping-link"
                        >
                            Continue Shopping
                        </Link>

                    </aside>

                </div>

            </div>

        </div>
    );
}

export default Cart;