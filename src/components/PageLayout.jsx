import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

export default function PageLayout({
    title,
    subtitle,
    actions,
    maxWidth = "md",
    children,
}) {
    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 140px)",
                width: "100%",
                py: { xs: 3, sm: 4 },
                px: { xs: 2, sm: 3 },
            }}
        >
            <Container maxWidth={maxWidth}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2.5, sm: 3 },
                        borderRadius: 3,
                        borderColor: (theme) => alpha(theme.palette.common.white, 0.08),
                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.88),
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {(title || subtitle || actions) && (
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            sx={{ mb: 2.5 }}
                        >
                            <Box sx={{ minWidth: 0 }}>
                                {title && (
                                    <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
                                        {title}
                                    </Typography>
                                )}
                                {subtitle && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                        {subtitle}
                                    </Typography>
                                )}
                            </Box>
                            {actions ? <Box sx={{ flex: "0 0 auto" }}>{actions}</Box> : null}
                        </Stack>
                    )}

                    {children}
                </Paper>
            </Container>
        </Box>
    );
}
