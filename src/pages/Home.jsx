import { apiService } from "../services/api";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
    BoltOutlined,
    GppGoodOutlined,
    SupportAgentOutlined,
} from "@mui/icons-material";

import PageLayout from "../components/PageLayout";

const Home = () => {

    const isAuthenticated = apiService.isAuthenticated();

    return (
        <PageLayout maxWidth="lg">
            <Stack spacing={1.25} alignItems="center" sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.03em" }}>
                    Welcome to Shark Bank
                </Typography>
                <Typography color="text.secondary">
                    Your secure and modern banking solution
                </Typography>

                {!isAuthenticated ? (
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{ mt: 0.75, width: { xs: "100%", sm: "auto" } }}
                    >
                        <Button component={RouterLink} to="/register" variant="contained">
                            Get Started
                        </Button>
                        <Button component={RouterLink} to="/login" variant="outlined">
                            Log in
                        </Button>
                    </Stack>
                ) : null}
            </Stack>

            <Divider
                sx={{
                    my: 3,
                    opacity: 0.28,
                    borderBottomWidth: 2,
                }}
            />

            <Box>
                <Typography
                    variant="h6"
                    align="center"
                    sx={{ fontWeight: 900, letterSpacing: "-0.02em", mb: 1.5 }}
                >
                    Why Choose Shark Bank?
                </Typography>

                {/* Keep legacy grid + hover animation */}
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

                <Box sx={{ mt: { xs: 3, sm: 4 } }} />
            </Box>
        </PageLayout>
    )

}

export default Home;