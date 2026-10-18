import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Categories from "./pages/Categories";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
    path="/cart"
    element={
        <ProtectedRoute>
            <Cart />
        </ProtectedRoute>
    }
/>

<Route
    path="/checkout"
    element={
        <ProtectedRoute>
            <Checkout />
        </ProtectedRoute>
    }
/>

<Route
    path="/orders"
    element={
        <ProtectedRoute>
            <Orders />
        </ProtectedRoute>
    }
/>

<Route
    path="/categories"
    element={
        <ProtectedRoute adminOnly>
            <Categories />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/products"
    element={
        <ProtectedRoute adminOnly>
            <AdminProducts />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/orders"
    element={
        <ProtectedRoute adminOnly>
            <AdminOrders />
        </ProtectedRoute>
    }
/>
            </Routes>
        </>
    );
}

export default App;