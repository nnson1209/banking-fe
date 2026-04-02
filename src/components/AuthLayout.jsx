import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
    AccountBalance,
    AccountBalanceWalletOutlined,
    CurrencyExchangeOutlined,
    GppGoodOutlined,
} from "@mui/icons-material";

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 140px)",
                width: "100%",
                display: "grid",
                placeItems: "center",
                px: { xs: 2, sm: 3 },
                position: "relative",
                overflow: "hidden",
                backgroundImage: (theme) =>
                    `radial-gradient(980px circle at 18% 14%, ${alpha(
                        theme.palette.primary.main,
                        0.3
                    )} 0%, transparent 60%),
           radial-gradient(900px circle at 82% 86%, ${alpha(
                        theme.palette.success.main,
                        0.22
                    )} 0%, transparent 60%),
           radial-gradient(1200px circle at 50% 105%, ${alpha(
                        theme.palette.common.white,
                        0.07
                    )} 0%, transparent 55%),
           linear-gradient(180deg, ${alpha(
                        theme.palette.common.white,
                        0.06
                    )} 0%, ${alpha(theme.palette.background.default, 0.88)} 48%, ${alpha(
                        theme.palette.background.paper,
                        0.96
                    )} 100%)`,
            }}
        >
            {/* Decorative background */}
            <Box aria-hidden sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <AccountBalanceWalletOutlined
                    sx={{
                        position: "absolute",
                        top: { xs: 40, sm: 60 },
                        left: { xs: 16, sm: 48 },
                        fontSize: { xs: 120, sm: 190 },
                        color: (theme) => alpha(theme.palette.common.white, 0.05),
                        transform: "rotate(-12deg)",
                    }}
                />
                <GppGoodOutlined
                    sx={{
                        position: "absolute",
                        bottom: { xs: 30, sm: 48 },
                        right: { xs: 18, sm: 54 },
                        fontSize: { xs: 140, sm: 220 },
                        color: (theme) => alpha(theme.palette.common.white, 0.048),
                        transform: "rotate(10deg)",
                    }}
                />
                <CurrencyExchangeOutlined
                    sx={{
                        position: "absolute",
                        top: { xs: 140, sm: 180 },
                        right: { xs: 46, sm: 140 },
                        fontSize: { xs: 46, sm: 58 },
                        color: (theme) => alpha(theme.palette.primary.main, 0.13),
                        transform: "rotate(8deg)",
                    }}
                />
            </Box>

            <Container maxWidth="xs" sx={{ position: "relative" }}>
                <Paper
                    variant="outlined"
                    sx={{
                        width: "100%",
                        p: { xs: 2.5, sm: 3 },
                        borderRadius: "14px",
                        borderColor: (theme) => alpha(theme.palette.common.white, 0.08),
                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                                sx={{
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                                    color: "primary.main",
                                    width: 44,
                                    height: 44,
                                }}
                            >
                                <AccountBalance />
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontWeight: 900,
                                        letterSpacing: "-0.02em",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Shark Bank
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Secure, modern banking
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="h5" sx={{ mt: 2, mb: 0.5, fontWeight: 900 }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </Box>

                    {children}
                </Paper>
            </Container>
        </Box>
    );
}
