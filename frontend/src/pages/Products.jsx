import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/products",
                    {
                        params: {
                            search: search,
                            category: category
                        }
                    }
                );

                setProducts(response.data);

            } catch (error) {
                console.error(
                    "Error fetching products:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Could not load products"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, [search, category]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get(
                    "/categories"
                );

                setCategories(response.data);

            } catch (error) {
                console.error(
                    "Error fetching categories:",
                    error
                );
            }
        };

        fetchCategories();

    }, []);

    return (
        <div className="products-page">

            <section className="products-header">

                <p className="products-small-title">
                    OUR COLLECTION
                </p>

                <h1>
                    Products
                </h1>

                <p>
                    Discover products you'll love,
                    all in one place.
                </p>

            </section>


            <section className="products-controls">

                <div className="search-wrapper">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>


                <select
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value)
                    }
                >
                    <option value="">
                        All Categories
                    </option>

                    {categories.map((item) => (
                        <option
                            key={item.category_id}
                            value={item.category_id}
                        >
                            {item.name}
                        </option>
                    ))}
                </select>

            </section>


            <section className="products-results">

                {loading ? (
                    <div className="products-message">
                        <p>
                            Loading products...
                        </p>
                    </div>

                ) : error ? (
                    <div className="products-message error-message">
                        <p>
                            {error}
                        </p>
                    </div>

                ) : products.length === 0 ? (
                    <div className="products-message">
                        <div className="empty-products-icon">
                            🔍
                        </div>

                        <h2>
                            No products found
                        </h2>

                        <p>
                            Try changing your search
                            or category filter.
                        </p>
                    </div>

                ) : (
                    <div className="products-grid">

                        {products.map((product) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                            />
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Products;