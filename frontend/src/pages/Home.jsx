import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    return (
        <div className="home-page">

            <section className="hero-section">

                <div className="hero-content">

                    <p className="hero-small-text">
                        WELCOME TO A2Z
                    </p>

                    <h1>
                        Shop Smart.
                        <br />
                        Shop A2Z.
                    </h1>

                    <p className="hero-description">
                        Discover products you'll love,
                        all in one place.
                    </p>

                    <Link
                        to="/products"
                        className="hero-button"
                    >
                        Shop Now
                    </Link>

                </div>

            </section>


            <section className="features-section">

                <div className="section-heading">

                    <p className="section-small-text">
                        WHY CHOOSE US
                    </p>

                    <h2>
                        Why Shop With A2Z?
                    </h2>

                    <p>
                        Everything you need for a simple
                        and enjoyable shopping experience.
                    </p>

                </div>


                <div className="features-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            🛒
                        </div>

                        <h3>
                            Easy Shopping
                        </h3>

                        <p>
                            Browse products and add your
                            favorites to your cart with ease.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ✓
                        </div>

                        <h3>
                            Reliable Products
                        </h3>

                        <p>
                            Find products with clear pricing,
                            stock information and details.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ⚡
                        </div>

                        <h3>
                            Simple Checkout
                        </h3>

                        <p>
                            Place your order through a simple
                            and straightforward checkout process.
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;