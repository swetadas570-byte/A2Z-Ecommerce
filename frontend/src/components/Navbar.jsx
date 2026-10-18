import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
    const { user, logout } = useAuth();

    const { darkMode, toggleTheme } = useTheme();

    return (
        <nav className="navbar">

            <h2 className="navbar-brand">
                A2Z
            </h2>

            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

                {!user && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

                {user && user.role === "customer" && (
                    <>
                        <Link to="/cart">
                            Cart
                        </Link>

                        <Link to="/orders">
                            Orders
                        </Link>

                        <button onClick={logout}>
                            Logout
                        </button>
                    </>
                )}

                {user && user.role === "admin" && (
                    <>
                        <Link to="/categories">
                            Categories
                        </Link>

                        <Link to="/admin/products">
                            Manage Products
                        </Link>

                        <Link to="/admin/orders">
                            Orders
                        </Link>

                        <button onClick={logout}>
                            Logout
                        </button>
                    </>
                )}

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>

            </div>

        </nav>
    );
}

export default Navbar;