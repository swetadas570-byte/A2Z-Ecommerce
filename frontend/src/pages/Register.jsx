import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    const { fetchCurrentUser } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            setMessage("");

            const response = await api.post(
                "/auth/register",
                {
                    name: name,
                    email: email,
                    password: password
                }
            );

            setMessage(response.data.message);

            await fetchCurrentUser();

            navigate("/products");

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                <div className="auth-header">

                    <p className="auth-small-title">
                        JOIN A2Z
                    </p>

                    <h1>
                        Create an Account
                    </h1>

                    <p>
                        Create your account and start shopping.
                    </p>

                </div>


                <form
                    className="auth-form"
                    onSubmit={handleRegister}
                >

                    <div className="form-group">

                        <label htmlFor="register-name">
                            Full Name
                        </label>

                        <input
                            id="register-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your name"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="register-email">
                            Email
                        </label>

                        <input
                            id="register-email"
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

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Create a password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-submit-button"
                    >
                        Create Account
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

export default Register;