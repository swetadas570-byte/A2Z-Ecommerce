import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [cartMessage, setCartMessage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/products/${id}`
                );

                setProduct(response.data);

            } catch (error) {
                console.error(
                    "Error fetching product:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Could not load product"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

    }, [id]);

    const handleAddToCart = async () => {
        try {
            setCartMessage("");

            const response = await api.post(
                "/cart",
                {
                    product_id: product.product_id,
                    quantity: quantity
                }
            );

            setCartMessage(
                response.data.message
            );

        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            setCartMessage(
                error.response?.data?.message ||
                "Could not add product to cart"
            );
        }
    };

    const decreaseQuantity = () => {
        setQuantity((currentQuantity) =>
            Math.max(1, currentQuantity - 1)
        );
    };

    const increaseQuantity = () => {
        setQuantity((currentQuantity) =>
            Math.min(
                product.stock,
                currentQuantity + 1
            )
        );
    };

    if (loading) {
        return (
            <div className="product-details-message">
                <p>Loading product...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-details-message error-message">
                <p>{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-message">
                <p>Product not found.</p>
            </div>
        );
    }

    return (
        <div className="product-details-page">

            <div className="product-details-container">

                <div className="product-details-image">

                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                        />
                    ) : (
                        <div className="product-details-no-image">
                            No image available
                        </div>
                    )}

                </div>


                <div className="product-details-content">

                    <p className="product-details-label">
                        PRODUCT DETAILS
                    </p>

                    <h1>
                        {product.name}
                    </h1>

                    <p className="product-details-price">
                        ₹{Number(product.price).toFixed(2)}
                    </p>

                    <div className="product-details-stock">

                        {product.stock > 0 ? (
                            <>
                                <span className="stock-dot"></span>

                                <span>
                                    {product.stock} items
                                    available
                                </span>
                            </>
                        ) : (
                            <span className="out-of-stock-text">
                                Out of stock
                            </span>
                        )}

                    </div>


                    <div className="product-details-description">

                        <h2>
                            Description
                        </h2>

                        <p>
                            {product.description ||
                                "No description available for this product."}
                        </p>

                    </div>


                    {product.stock > 0 && (
                        <div className="product-purchase">

                            <label>
                                Quantity
                            </label>

                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={
                                        decreaseQuantity
                                    }
                                    disabled={
                                        quantity <= 1
                                    }
                                >
                                    −
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        increaseQuantity
                                    }
                                    disabled={
                                        quantity >=
                                        product.stock
                                    }
                                >
                                    +
                                </button>

                            </div>


                            <button
                                type="button"
                                className="add-to-cart-button"
                                onClick={
                                    handleAddToCart
                                }
                            >
                                Add to Cart
                            </button>


                            {cartMessage && (
                                <p
                                    className={
                                        cartMessage.includes(
                                            "successfully"
                                        ) ||
                                        cartMessage.includes(
                                            "added"
                                        )
                                            ? "cart-success-message"
                                            : "cart-error-message"
                                    }
                                >
                                    {cartMessage}
                                </p>
                            )}

                        </div>
                    )}

                    {product.stock === 0 && (
                        <p className="unavailable-message">
                            This product is currently
                            unavailable.
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default ProductDetails;