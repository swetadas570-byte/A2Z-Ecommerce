import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";

function Checkout() {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const response = await api.get(
                    "/cart"
                );

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

        fetchCart();

    }, []);


    const totalAmount = cartItems.reduce(
        (total, item) => {
            return total + Number(item.subtotal);
        },
        0
    );


    const handlePlaceOrder = async (event) => {

        event.preventDefault();

        if (!shippingAddress.trim()) {

            setError(
                "Shipping address is required"
            );

            return;
        }

        try {

            setError("");
            setPlacingOrder(true);

            await api.post(
                "/orders",
                {
                    shipping_address:
                        shippingAddress
                }
            );

            navigate("/orders");

        } catch (error) {

            console.error(
                "Place order error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Could not place order"
            );

        } finally {

            setPlacingOrder(false);

        }
    };


    if (loading) {

        return (
            <div className="checkout-message-page">
                <p>
                    Loading checkout...
                </p>
            </div>
        );

    }


    if (cartItems.length === 0) {

        return (
            <div className="empty-checkout-page">

                <div className="empty-checkout-icon">
                    🛒
                </div>

                <h1>
                    Your Cart is Empty
                </h1>

                <p>
                    Add some products to your cart
                    before checking out.
                </p>

                <button
                    type="button"
                    className="back-to-products-button"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Browse Products
                </button>

            </div>
        );

    }


    return (
        <div className="checkout-page">

            <div className="checkout-container">


                <div className="checkout-header">

                    <p className="checkout-small-title">
                        CHECKOUT
                    </p>

                    <h1>
                        Complete Your Order
                    </h1>

                    <p>
                        Review your order and enter
                        your shipping information.
                    </p>

                </div>


                {error && (
                    <div className="checkout-error">
                        {error}
                    </div>
                )}


                <div className="checkout-layout">


                    <section className="shipping-section">

                        <div className="checkout-card">

                            <h2>
                                Shipping Information
                            </h2>

                            <p className="checkout-card-description">
                                Enter the address where
                                you would like your order
                                delivered.
                            </p>


                            <form
                                className="shipping-form"
                                onSubmit={
                                    handlePlaceOrder
                                }
                            >

                                <div className="form-group">

                                    <label htmlFor="shipping-address">
                                        Shipping Address
                                    </label>

                                    <textarea
                                        id="shipping-address"
                                        value={
                                            shippingAddress
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setShippingAddress(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your complete shipping address"
                                        rows="7"
                                        required
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="place-order-button"
                                    disabled={
                                        placingOrder
                                    }
                                >
                                    {placingOrder
                                        ? "Placing Order..."
                                        : "Place Order"}
                                </button>

                            </form>

                        </div>

                    </section>


                    <aside className="checkout-summary">

                        <h2>
                            Order Summary
                        </h2>


                        <div className="checkout-items">

                            {cartItems.map((item) => (

                                <div
                                    className="checkout-item"
                                    key={
                                        item.cart_item_id
                                    }
                                >

                                    <div className="checkout-item-image">

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


                                    <div className="checkout-item-details">

                                        <h3>
                                            {item.name}
                                        </h3>

                                        <p>
                                            ₹
                                            {Number(
                                                item.price
                                            ).toFixed(2)}
                                            {" "}×{" "}
                                            {item.quantity}
                                        </p>

                                    </div>


                                    <strong>
                                        ₹
                                        {Number(
                                            item.subtotal
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            ))}

                        </div>


                        <div className="checkout-divider"></div>


                        <div className="checkout-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {totalAmount.toFixed(2)}
                            </strong>

                        </div>


                        <p className="checkout-note">
                            Your order will be placed
                            after you submit the shipping
                            information.
                        </p>

                    </aside>

                </div>

            </div>

        </div>
    );
}

export default Checkout;