import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import PageLayout from "../components/PageLayout";

const NotFound = () => {
    return (
        <PageLayout
            title="Page Not Found"
            subtitle="Oops! The page you're looking for seems to have wandered off into the digital wilderness."
            maxWidth="sm"
        >
            <Box sx={{ textAlign: "center", py: { xs: 1, sm: 2 } }}>
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 900,
                        letterSpacing: "-0.06em",
                        lineHeight: 1,
                        opacity: 0.9,
                        fontSize: { xs: 64, sm: 88 },
                    }}
                >
                    404
                </Typography>
            </Box>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                justifyContent="center"
                sx={{ mt: 1, mb: 2.5 }}
            >
                <Button component={RouterLink} to="/home" variant="contained">
                    Go Home
                </Button>
                <Button onClick={() => window.history.back()} variant="outlined">
                    Go Back
                </Button>
            </Stack>

            <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 1.5, mb: 0.5 }}>
                While you're here, you might want to:
            </Typography>
            <List dense disablePadding>
                <ListItem disableGutters>
                    <ListItemText primary="Check the URL for typos" />
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText primary="Return to our homepage" />
                </ListItem>
                <ListItem disableGutters>
                    <ListItemText primary="Contact support if you believe this is an error" />
                </ListItem>
            </List>
        </PageLayout>
    );
};

export default NotFound;