import { apiService } from "../services/api";
import {
    BoltOutlined,
    GppGoodOutlined,
    SupportAgentOutlined,
} from "@mui/icons-material";

const Home = () => {

    const isAuthenticated = apiService.isAuthenticated();

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Shark Bank</h1>
                    <p>Your secure and modern banking solution</p>
                    {!isAuthenticated && (
                        <div className="hero-buttons">
                            <a href="/register" className="btn btn-primary">Get Started</a>
                            <a href="/login" className="btn btn-secondary">Log in</a>
                        </div>
                    )}
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <h2>Why Choose Shark Bank?</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <div className="feature-icon">
                                <GppGoodOutlined fontSize="inherit" />
                            </div>
                            <h3>Secure by design</h3>
                            <p>Bank‑grade protection for your money and personal information.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <BoltOutlined fontSize="inherit" />
                            </div>
                            <h3>Fast transactions</h3>
                            <p>Transfers that feel instant — with clear status updates.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">
                                <SupportAgentOutlined fontSize="inherit" />
                            </div>
                            <h3>Reliable support</h3>
                            <p>Built for daily banking — simple flows, predictable results.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )

}

export default Home;