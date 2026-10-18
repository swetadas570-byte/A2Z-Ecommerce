import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    const { fetchCurrentUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            setMessage("");

            const response = await api.post(
                "/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            setMessage(response.data.message);

            await fetchCurrentUser();

            navigate("/products");

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <p className="auth-small-title">
                        WELCOME BACK
                    </p>

                    <h1>
                        Login to A2Z
                    </h1>

                    <p>
                        Sign in to continue shopping.
                    </p>

                </div>


                <form
                    className="auth-form"
                    onSubmit={handleLogin}
                >

                    <div className="form-group">

                        <label htmlFor="login-email">
                            Email
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="login-password">
                            Password
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-submit-button"
                    >
                        Login
                    </button>

                </form>


                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}

export default Login;