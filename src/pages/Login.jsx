import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";


const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleAutoFill = (e) => {
        if (e.animationName !== "mui-auto-fill") return;

        const { name, value } = e.target;
        if (!name) return;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');

        try {

            const response = await apiService.login(formData);

            if (response.data.statusCode === 200) {
                apiService.saveAuthData(response.data.data.token, response.data.data.roles);
                navigate('/home')
            } else {

                setError(response.data.message || 'Login failed');
            }

        } catch (error) {

            setError(error.response?.data?.message || error.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }



    return (
        <AuthLayout
            title="Log in"
            subtitle="Welcome back — access your account securely."
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    sx={{ mb: 2 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 1 }}>
                                    <Email fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        },
                        htmlInput: {
                            onAnimationStart: handleAutoFill,
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    sx={{ mb: 3 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 1 }}>
                                    <Lock fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end" sx={{ m: 0, alignSelf: "center" }}>
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        color="inherit"
                                        sx={(theme) => ({
                                            color: theme.palette.text.secondary,
                                            bgcolor: "transparent",
                                            "&:hover": { bgcolor: "transparent" },
                                        })}
                                    >
                                        {showPassword ? (
                                            <VisibilityOff fontSize="small" />
                                        ) : (
                                            <Visibility fontSize="small" />
                                        )}
                                    </IconButton>
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
                    {loading ? "Logging in…" : "Log in"}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
                    <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
                        Forgot password?{" "}
                        <Link
                            component={RouterLink}
                            to="/forgot-password"
                            underline="hover"
                            color="primary"
                            sx={{ fontWeight: 800 }}
                        >
                            Reset it
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </AuthLayout>
    );

}
export default Login;