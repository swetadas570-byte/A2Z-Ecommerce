import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
    return (
        <article className="product-card">

            <Link
                to={`/products/${product.product_id}`}
                className="product-image-link"
            >
                <div className="product-image">

                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                        />
                    ) : (
                        <div className="no-product-image">
                            <span>
                                No image
                            </span>
                        </div>
                    )}

                </div>
            </Link>


            <div className="product-info">

                <h3>
                    {product.name}
                </h3>

                <p className="product-price">
                    ₹{Number(product.price).toFixed(2)}
                </p>

                <p
                    className={
                        product.stock > 0
                            ? "product-stock"
                            : "product-stock out-of-stock"
                    }
                >
                    {product.stock > 0
                        ? `Stock: ${product.stock}`
                        : "Out of stock"}
                </p>

                <Link
                    to={`/products/${product.product_id}`}
                    className="view-product-button"
                >
                    View Details
                </Link>

            </div>

        </article>
    );
}

export default ProductCard;