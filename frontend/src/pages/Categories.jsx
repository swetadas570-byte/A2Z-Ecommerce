import { useEffect, useState } from "react";
import api from "../services/api";
import "./Categories.css";

function Categories() {

    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);


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

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchCategories();

    }, []);


    const handleAddCategory = async (event) => {

        event.preventDefault();

        if (!categoryName.trim()) {

            setMessage(
                "Category name is required"
            );

            return;
        }

        try {

            const response = await api.post(
                "/categories",
                {
                    name: categoryName
                }
            );

            setMessage(
                response.data.message
            );

            setCategoryName("");

            await fetchCategories();

        } catch (error) {

            console.error(
                "Add category error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not add category"
            );
        }
    };


    const handleEdit = (category) => {

        setEditingId(
            category.category_id
        );

        setEditingName(
            category.name
        );

        setMessage("");
    };


    const handleUpdateCategory = async (id) => {

        if (!editingName.trim()) {

            setMessage(
                "Category name is required"
            );

            return;
        }

        try {

            const response = await api.put(
                `/categories/${id}`,
                {
                    name: editingName
                }
            );

            setMessage(
                response.data.message
            );

            setEditingId(null);
            setEditingName("");

            await fetchCategories();

        } catch (error) {

            console.error(
                "Update category error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not update category"
            );
        }
    };


    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {

            return;
        }

        try {

            const response = await api.delete(
                `/categories/${id}`
            );

            setMessage(
                response.data.message
            );

            await fetchCategories();

        } catch (error) {

            console.error(
                "Delete category error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Could not delete category"
            );
        }
    };


    const handleCancelEdit = () => {

        setEditingId(null);
        setEditingName("");
        setMessage("");
    };


    if (loading) {

        return (
            <div className="categories-message-page">
                <p>
                    Loading categories...
                </p>
            </div>
        );

    }


    return (
        <div className="categories-page">

            <div className="categories-container">


                <div className="categories-header">

                    <p className="categories-small-title">
                        ADMINISTRATION
                    </p>

                    <h1>
                        Category Management
                    </h1>

                    <p>
                        Create, edit and manage product
                        categories.
                    </p>

                </div>


                {message && (
                    <div className="categories-message">
                        {message}
                    </div>
                )}


                <div className="categories-layout">


                    <section className="category-form-card">

                        <h2>
                            {editingId
                                ? "Edit Category"
                                : "Add Category"}
                        </h2>

                        <p>
                            {editingId
                                ? "Update the selected category name."
                                : "Create a new category for your products."}
                        </p>


                        <form
                            className="category-form"
                            onSubmit={
                                editingId
                                    ? (event) => {
                                        event.preventDefault();

                                        handleUpdateCategory(
                                            editingId
                                        );
                                    }
                                    : handleAddCategory
                            }
                        >

                            <div className="category-form-group">

                                <label htmlFor="category-name">
                                    Category Name
                                </label>

                                <input
                                    id="category-name"
                                    type="text"
                                    value={
                                        editingId
                                            ? editingName
                                            : categoryName
                                    }
                                    onChange={(event) => {

                                        if (editingId) {

                                            setEditingName(
                                                event.target.value
                                            );

                                        } else {

                                            setCategoryName(
                                                event.target.value
                                            );

                                        }

                                    }}
                                    placeholder="Enter category name"
                                />

                            </div>


                            <div className="category-form-actions">

                                <button
                                    type="submit"
                                    className="category-primary-button"
                                >
                                    {editingId
                                        ? "Save Changes"
                                        : "Add Category"}
                                </button>


                                {editingId && (
                                    <button
                                        type="button"
                                        className="category-cancel-button"
                                        onClick={
                                            handleCancelEdit
                                        }
                                    >
                                        Cancel
                                    </button>
                                )}

                            </div>

                        </form>

                    </section>


                    <section className="category-list-card">

                        <div className="category-list-header">

                            <div>

                                <h2>
                                    Existing Categories
                                </h2>

                                <p>
                                    {categories.length}{" "}
                                    {categories.length === 1
                                        ? "category"
                                        : "categories"}
                                </p>

                            </div>

                        </div>


                        {categories.length === 0 ? (

                            <div className="no-categories">

                                <div className="no-categories-icon">
                                    📂
                                </div>

                                <h3>
                                    No Categories Yet
                                </h3>

                                <p>
                                    Add your first category
                                    using the form.
                                </p>

                            </div>

                        ) : (

                            <div className="category-list">

                                {categories.map(
                                    (category, index) => (

                                        <div
                                            className="category-item"
                                            key={
                                                category.category_id
                                            }
                                        >

                                            <div className="category-number">
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </div>


                                            <div className="category-name">
                                                {category.name}
                                            </div>


                                            <div className="category-actions">

                                                <button
                                                    type="button"
                                                    className="category-edit-button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            category
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="category-delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            category.category_id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </div>

            </div>

        </div>
    );
}

export default Categories;