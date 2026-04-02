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
import {
    Email,
    Lock,
    Person,
    PhoneIphone,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";


const Register = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });


    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleAutoFill = (e) => {
        if (e.animationName !== "mui-auto-fill") return;

        const { name, value } = e.target;
        if (!name) return;

        if (name === "confirmPassword") {
            setConfirmPassword(value);
            return;
        }

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
        setLoading(true)
        setError('')
        setSuccess('')
        setValidationError('')

        if (formData.password !== confirmPassword) {
            setValidationError('Passwords do not match');
            setLoading(false);
            return;
        }

        if ((formData.password || '').length < 6) {
            setValidationError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await apiService.register(formData);

            if (response.data.statusCode === 200) {
                setSuccess(response.data.message);
                setTimeout(() => {
                    navigate('/login')
                }, 4000)
            } else {
                setError(response.data.message);
            }

        } catch (error) {

            setError(error.response?.data?.message || error.message || 'Registration failed')

        } finally {
            setLoading(false)
        }
    }




    return (
        <AuthLayout
            title="Create account"
            subtitle="Create your Shark Bank account in seconds."
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                {(error || validationError) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error || validationError}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        label="First name"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        autoComplete="given-name"
                        sx={(theme) => ({
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
                                        <Person fontSize="small" color="action" />
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
                        label="Last name"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        autoComplete="family-name"
                        sx={(theme) => ({
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
                                        <Person fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            },
                            htmlInput: {
                                onAnimationStart: handleAutoFill,
                            },
                        }}
                    />
                </Box>

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
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
                    label="Phone number"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
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
                                    <PhoneIphone fontSize="small" color="action" />
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

                <TextField
                    fullWidth
                    label="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? "Creating account…" : "Create account"}
                </Button>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Already have an account?{" "}
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

export default Register;