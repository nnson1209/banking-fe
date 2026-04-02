import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import PageLayout from "../components/PageLayout";
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";



const UpdateProfile = () => {

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleAutoFill = (e) => {
        if (e.animationName !== "mui-auto-fill") return;

        const { name, value } = e.target;
        if (!name) return;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordData({
            ...passwordData,
            [name]: value
        });

        // Clear validation errors when user types
        if (validationErrors[name]) {
            setValidationErrors({
                ...validationErrors,
                [name]: ''
            });
        }
    }

    const validateForm = () => {
        const errors = {}

        if (!passwordData.oldPassword) {
            errors.oldPassword = 'Current password is required';
        }

        if (!passwordData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        }

        if (!passwordData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your new password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }


        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }




    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await apiService.updatePassword(
                passwordData.oldPassword,
                passwordData.newPassword
            );

            if (response.data.statusCode === 200) {
                setSuccess('Password updated successfully');
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                setTimeout(() => {
                    navigate('/profile');
                }, 4000);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while updating password');
        } finally {
            setLoading(false);
        }
    };






    return (
        <PageLayout
            title="Change password"
            subtitle="Enter your current password and set a new one."
            maxWidth="sm"
            actions={
                <Button variant="outlined" onClick={() => navigate("/profile")}>
                    Back to profile
                </Button>
            }
        >
            <Stack spacing={2.25}>
                {(error || success) && (
                    <Alert severity={error ? "error" : "success"}>{error || success}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Current password"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            type={showOldPassword ? "text" : "password"}
                            autoComplete="current-password"
                            error={Boolean(validationErrors.oldPassword)}
                            helperText={validationErrors.oldPassword || " "}
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
                                                onClick={() => setShowOldPassword((v) => !v)}
                                                edge="end"
                                                color="inherit"
                                                sx={(theme) => ({
                                                    color: theme.palette.text.secondary,
                                                    bgcolor: "transparent",
                                                    "&:hover": { bgcolor: "transparent" },
                                                })}
                                            >
                                                {showOldPassword ? (
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
                            label="New password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            type={showNewPassword ? "text" : "password"}
                            autoComplete="new-password"
                            error={Boolean(validationErrors.newPassword)}
                            helperText={validationErrors.newPassword || "At least 6 characters"}
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
                                                onClick={() => setShowNewPassword((v) => !v)}
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
                            label="Confirm new password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            error={Boolean(validationErrors.confirmPassword)}
                            helperText={validationErrors.confirmPassword || " "}
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
                                                onClick={() => setShowConfirmPassword((v) => !v)}
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

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ pt: 0.5 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{ flex: 1, py: 1.1 }}
                            >
                                {loading ? "Updating…" : "Update password"}
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() => navigate("/profile")}
                                sx={{ flex: 1, py: 1.1 }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                <Box>
                    <Typography sx={{ fontWeight: 900, mb: 0.75 }}>Password guidelines</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Use at least 6 characters and avoid easily guessable information.
                    </Typography>
                </Box>
            </Stack>
        </PageLayout>
    );

}

export default UpdateProfile;