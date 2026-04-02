import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
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
import { Lock, Visibility, VisibilityOff, VpnKey } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";


const ResetPassword = () => {

    const [formData, setFormData] = useState({
        code: '',
        newPassword: '',
        confirmPassword: ''
    });


    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleAutoFill = (e) => {
        if (e.animationName !== "mui-auto-fill") return;

        const { name, value } = e.target;
        if (!name) return;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    useEffect(() => {

        const codeFromUrl = searchParams.get('code');

        if (codeFromUrl) {
            setFormData(prev => ({
                ...prev,
                code: codeFromUrl
            }));
        }

    }, [searchParams])


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');


        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }


        // Validate password strength (optional)
        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const resetData = {
                code: formData.code,
                newPassword: formData.newPassword
            }

            const response = await apiService.resetPassword(resetData);

            if (response.data.statusCode === 200) {
                setSuccess('Password has been updated successfully! Redirecting to login...');

                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                setError(response.data.message);
            }

        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while resetting password');
        } finally {
            setLoading(false);
        }
    }



    return (
        <AuthLayout
            title="Reset password"
            subtitle="Enter your code and set a new password."
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
                    label="Reset code"
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    autoComplete="one-time-code"
                    sx={(theme) => ({
                        mb: 2,
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
                                    <VpnKey fontSize="small" color="action" />
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
                    label="New password"
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    sx={(theme) => ({
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.06),
                            borderRadius: "10px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.common.white, 0.14),
                        },
                    })}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end" sx={{ m: 0, alignSelf: "center" }}>
                                    <IconButton
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                        color="inherit"
                                        sx={(theme) => ({
                                            color: theme.palette.text.secondary,
                                            bgcolor: "transparent",
                                            "&:hover": { bgcolor: "transparent" },
                                        })}
                                    >
                                        {showNewPassword ? (
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

                <TextField
                    fullWidth
                    label="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    sx={(theme) => ({
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.06),
                            borderRadius: "10px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.common.white, 0.14),
                        },
                    })}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end" sx={{ m: 0, alignSelf: "center" }}>
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        color="inherit"
                                        sx={(theme) => ({
                                            color: theme.palette.text.secondary,
                                            bgcolor: "transparent",
                                            "&:hover": { bgcolor: "transparent" },
                                        })}
                                    >
                                        {showConfirmPassword ? (
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
                    {loading ? "Resetting…" : "Reset password"}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Need a new code?{" "}
                        <Link
                            component={RouterLink}
                            to="/forgot-password"
                            underline="hover"
                            color="primary"
                            sx={{ fontWeight: 800 }}
                        >
                            Request another
                        </Link>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
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
                </Box>
            </Box>
        </AuthLayout>
    );

}

export default ResetPassword;