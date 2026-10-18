import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminProducts.css";

function AdminProducts() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);


    const fetchProducts = async () => {

        try {

            const response = await api.get(
                "/products"
            );

            setProducts(response.data);

        } catch (error) {

            console.error(
                "Error fetching products:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not load products"
            );

        }
    };


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

            setMessage(
                error.response?.data?.message ||
                "Could not load categories"
            );

        }
    };


    useEffect(() => {

        const loadData = async () => {

            await Promise.all([
                fetchProducts(),
                fetchCategories()
            ]);

            setLoading(false);
        };

        loadData();

    }, []);


    const clearForm = () => {

        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setImageUrl("");
        setCategoryId("");
        setEditingId(null);
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!name.trim()) {

            setMessage(
                "Product name is required"
            );

            return;
        }

        if (
            price === "" ||
            Number(price) < 0
        ) {

            setMessage(
                "Valid price is required"
            );

            return;
        }

        if (
            stock === "" ||
            Number(stock) < 0
        ) {

            setMessage(
                "Valid stock is required"
            );

            return;
        }


        try {

            const productData = {
                name: name,
                description: description,
                price: Number(price),
                stock: Number(stock),
                image_url: imageUrl,
                category_id: categoryId
                    ? Number(categoryId)
                    : null
            };


            let response;


            if (editingId) {

                response = await api.put(
                    `/products/${editingId}`,
                    productData
                );

            } else {

                response = await api.post(
                    "/products",
                    productData
                );

            }


            setMessage(
                response.data.message
            );

            clearForm();

            await fetchProducts();

        } catch (error) {

            console.error(
                "Save product error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not save product"
            );
        }
    };


    const handleEdit = (product) => {

        setEditingId(
            product.product_id
        );

        setName(
            product.name
        );

        setDescription(
            product.description || ""
        );

        setPrice(
            product.price
        );

        setStock(
            product.stock
        );

        setImageUrl(
            product.image_url || ""
        );

        setCategoryId(
            product.category_id
                ? String(product.category_id)
                : ""
        );

        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {

            return;
        }


        try {

            const response = await api.delete(
                `/products/${id}`
            );

            setMessage(
                response.data.message
            );

            await fetchProducts();

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not delete product"
            );
        }
    };


    if (loading) {

        return (
            <div className="admin-products-message-page">
                <p>
                    Loading products...
                </p>
            </div>
        );

    }


    return (
        <div className="admin-products-page">

            <div className="admin-products-container">


                <div className="admin-products-header">

                    <p className="admin-products-small-title">
                        ADMINISTRATION
                    </p>

                    <h1>
                        Product Management
                    </h1>

                    <p>
                        Add, edit and manage products
                        available in your store.
                    </p>

                </div>


                {message && (
                    <div className="admin-products-message">
                        {message}
                    </div>
                )}


                <section className="product-form-card">

                    <div className="product-form-header">

                        <div>

                            <p className="product-form-small-title">
                                {editingId
                                    ? "EDIT PRODUCT"
                                    : "NEW PRODUCT"}
                            </p>

                            <h2>
                                {editingId
                                    ? "Edit Product"
                                    : "Add Product"}
                            </h2>

                        </div>

                    </div>


                    <form
                        className="admin-product-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="product-form-grid">


                            <div className="admin-form-group product-name-field">

                                <label htmlFor="product-name">
                                    Product Name
                                </label>

                                <input
                                    id="product-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter product name"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label htmlFor="product-price">
                                    Price
                                </label>

                                <input
                                    id="product-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(event) =>
                                        setPrice(
                                            event.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label htmlFor="product-stock">
                                    Stock
                                </label>

                                <input
                                    id="product-stock"
                                    type="number"
                                    min="0"
                                    value={stock}
                                    onChange={(event) =>
                                        setStock(
                                            event.target.value
                                        )
                                    }
                                    placeholder="0"
                                />

                            </div>


                            <div className="admin-form-group">

                                <label htmlFor="product-category">
                                    Category
                                </label>

                                <select
                                    id="product-category"
                                    value={categoryId}
                                    onChange={(event) =>
                                        setCategoryId(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={
                                                    category.category_id
                                                }
                                                value={
                                                    category.category_id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="admin-form-group product-description-field">

                                <label htmlFor="product-description">
                                    Description
                                </label>

                                <textarea
                                    id="product-description"
                                    value={
                                        description
                                    }
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter product description"
                                    rows="5"
                                />

                            </div>


                            <div className="admin-form-group product-image-field">

                                <label htmlFor="product-image">
                                    Image URL
                                </label>

                                <input
                                    id="product-image"
                                    type="text"
                                    value={imageUrl}
                                    onChange={(event) =>
                                        setImageUrl(
                                            event.target.value
                                        )
                                    }
                                    placeholder="https://example.com/image.jpg"
                                />

                                <p className="form-help-text">
                                    Paste a publicly accessible
                                    image URL.
                                </p>

                            </div>

                        </div>


                        <div className="product-form-actions">

                            <button
                                type="submit"
                                className="admin-product-primary-button"
                            >
                                {editingId
                                    ? "Update Product"
                                    : "Add Product"}
                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="admin-product-cancel-button"
                                    onClick={clearForm}
                                >
                                    Cancel Edit
                                </button>

                            )}

                        </div>

                    </form>

                </section>


                <section className="existing-products-section">

                    <div className="existing-products-header">

                        <div>

                            <p className="product-form-small-title">
                                INVENTORY
                            </p>

                            <h2>
                                Existing Products
                            </h2>

                        </div>

                        <span className="product-count">
                            {products.length}{" "}
                            {products.length === 1
                                ? "product"
                                : "products"}
                        </span>

                    </div>


                    {products.length === 0 ? (

                        <div className="no-products-admin">

                            <div className="no-products-icon">
                                📦
                            </div>

                            <h3>
                                No Products Yet
                            </h3>

                            <p>
                                Add your first product
                                using the form above.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-products-list">

                            {products.map(
                                (product, index) => (

                                    <article
                                        className="admin-product-item"
                                        key={
                                            product.product_id
                                        }
                                    >


                                        <div className="admin-product-number">
                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </div>


                                        <div className="admin-product-image">

                                            {product.image_url ? (

                                                <img
                                                    src={
                                                        product.image_url
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                />

                                            ) : (

                                                <span>
                                                    No image
                                                </span>

                                            )}

                                        </div>


                                        <div className="admin-product-details">

                                            <h3>
                                                {
                                                    product.name
                                                }
                                            </h3>

                                            <p>
                                                {product.description ||
                                                    "No description available."}
                                            </p>

                                        </div>


                                        <div className="admin-product-meta">

                                            <div>

                                                <span>
                                                    Price
                                                </span>

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        product.price
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Stock
                                                </span>

                                                <strong
                                                    className={
                                                        product.stock >
                                                        0
                                                            ? "stock-available"
                                                            : "stock-unavailable"
                                                    }
                                                >
                                                    {
                                                        product.stock
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Category
                                                </span>

                                                <strong>
                                                    {
                                                        product.category_name ||
                                                        "Uncategorized"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="admin-product-actions">

                                            <button
                                                type="button"
                                                className="admin-edit-product-button"
                                                onClick={() =>
                                                    handleEdit(
                                                        product
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                type="button"
                                                className="admin-delete-product-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        product.product_id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>


                                    </article>

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default AdminProducts;