import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { apiService } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import { Alert, Box, Button, InputAdornment, Link, TextField, Typography } from "@mui/material";
import { Email } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";


const ForgotPassword = () => {


    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAutoFill = (e) => {
        if (e.animationName !== "mui-auto-fill") return;
        setEmail(e.target.value);
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {

            const response = await apiService.forgetPassword({ email })

            if (response.data.statusCode === 200) {
                setSuccess('An email with your reset code has been sent to your email address.');
                setEmail('');
            } else {
                setError(response.data.message);
            }
        } catch (error) {

            setError(error.response?.data?.message || 'An error occurred while sending reset email');
        } finally {
            setLoading(false)
        }
    }



    return (
        <AuthLayout
            title="Forgot password"
            subtitle="Enter your email to receive a reset code."
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    autoComplete="email"
                    sx={(theme) => ({
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.06),
                            borderRadius: "10px",
                        },
                        "& .MuiOutlinedInput-root:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.075),
                        },
                        "& .MuiOutlinedInput-root.Mui-focused": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.085),
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.common.white, 0.14),
                        },
                    })}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        },
                        htmlInput: {
                            onAnimationStart: handleAutoFill,
                        },
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ py: 1.25, borderRadius: "10px" }}
                >
                    {loading ? "Sending…" : "Send reset code"}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Remember your password?{" "}
                        <Link
                            component={RouterLink}
                            to="/login"
                            underline="hover"
                            color="primary"
                            sx={{ fontWeight: 800 }}
                        >
                            Log in
                        </Link>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
                        Don’t have an account?{" "}
                        <Link
                            component={RouterLink}
                            to="/register"
                            underline="hover"
                            color="primary"
                            sx={{ fontWeight: 800 }}
                        >
                            Create one
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </AuthLayout>
    );

}
export default ForgotPassword;