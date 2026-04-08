import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { apiService } from "../services/api";
import PageLayout from "../components/PageLayout";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PhotoCameraOutlined } from "@mui/icons-material";


const Profile = () => {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);


    const fetchUserProfile = async () => {
        setLoading(true);
        setError('')

        try {
            const response = await apiService.getMyProfile();

            if (response.data.statusCode === 200) {
                setUserData(response.data.data)
            } else {
                setError(response.data.message);
            }

        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while fetching profile data');
        } finally {
            setLoading(false)
        }
    }

    const uploadProfilePictureFile = async (file) => {
        setUploading(true);
        setError('');
        setSuccess('');

        try {

            const response = await apiService.uploadProfilePicture(file);

            if (response.data.statusCode === 200) {
                setSuccess('Profile picture updated successfully!');
                await fetchUserProfile();

                setTimeout(() => {
                    setSuccess('')
                }, 4000)
            }

        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while uploading profile picture');

        } finally {
            setUploading(false)
        }
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB');
                return
            }

            uploadProfilePictureFile(file);

        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };



    if (loading) {
        return (
            <PageLayout title="My profile" subtitle="Loading your information…" maxWidth="lg">
                <Typography color="text.secondary">Loading…</Typography>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout title="My profile" maxWidth="lg">
                <Alert severity="error">{error}</Alert>
            </PageLayout>
        );
    }

    if (!userData) {
        return (
            <PageLayout title="My profile" maxWidth="lg">
                <Alert severity="warning">No profile data available</Alert>
            </PageLayout>
        );
    }





    return (
        <PageLayout
            title="My profile"
            subtitle="Manage your details and accounts"
            maxWidth="lg"
            actions={
                <Button
                    component={RouterLink}
                    to="/update-profile"
                    variant="contained"
                >
                    Change password
                </Button>
            }
        >
            <Stack spacing={2.25}>
                {success && <Alert severity="success">{success}</Alert>}

                <Grid container spacing={2.25}>
                    <Grid item xs={12} md={5} sx={{ display: "flex" }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                p: 2.25,
                                borderRadius: 3,
                                borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                backgroundColor: (t) => alpha(t.palette.background.paper, 0.7),
                            }}
                        >
                            <Typography sx={{ fontWeight: 900, mb: 1 }}>Profile picture</Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                    src={userData.profilePictureUrl}
                                    alt="Profile"
                                    sx={{ width: 84, height: 84, bgcolor: (t) => alpha(t.palette.primary.main, 0.18) }}
                                />

                                <Box>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />

                                    <Button
                                        onClick={triggerFileInput}
                                        variant="contained"
                                        startIcon={<PhotoCameraOutlined />}
                                        disabled={uploading}
                                    >
                                        {uploading ? "Uploading…" : "Change picture"}
                                    </Button>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.75 }}>
                                        JPG/PNG/GIF, max 5MB
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={7} sx={{ display: "flex" }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                p: 2.25,
                                borderRadius: 3,
                                borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                backgroundColor: (t) => alpha(t.palette.background.paper, 0.7),
                            }}
                        >
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
                                <Typography sx={{ fontWeight: 900 }}>Personal information</Typography>
                                <Chip
                                    size="small"
                                    label={userData.active ? "ACTIVE" : "INACTIVE"}
                                    color={userData.active ? "success" : "default"}
                                    variant={userData.active ? "filled" : "outlined"}
                                />
                            </Stack>
                            <Divider sx={{ my: 1.75, opacity: 0.16 }} />

                            <Grid container spacing={1.75}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">First name</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{userData.firstName || "Not available"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Last name</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{userData.lastName || "Not available"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Email</Typography>
                                    <Typography sx={{ fontWeight: 700, wordBreak: "break-word" }}>{userData.email || "Not available"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{userData.phoneNumber || "Not available"}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

                <Box>
                    <Typography sx={{ fontWeight: 900, mb: 1.25 }}>My accounts</Typography>
                    {userData.accounts && userData.accounts.length > 0 ? (
                        <Stack spacing={1.5}>
                            {userData.accounts.map((account) => (
                                <Paper
                                    key={account.id}
                                    variant="outlined"
                                    sx={{
                                        p: 2.25,
                                        borderRadius: 3,
                                        borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                        backgroundColor: (t) => alpha(t.palette.background.paper, 0.7),
                                    }}
                                >
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
                                        <Typography sx={{ fontWeight: 900 }}>
                                            {account.accountType} account
                                        </Typography>
                                        <Chip size="small" label={account.status} variant="outlined" />
                                    </Stack>

                                    <Grid container spacing={1.75} sx={{ mt: 0.5 }}>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="caption" color="text.secondary">Account number</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>{account.accountNumber}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="caption" color="text.secondary">Balance</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>
                                                {account.currency} {Number(account.balance).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="caption" color="text.secondary">Created</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>
                                                {new Date(account.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 1.75, opacity: 0.16 }} />
                                    <Typography sx={{ fontWeight: 900, mb: 1 }}>Recent transactions</Typography>

                                    {account.transactions && account.transactions.length > 0 ? (
                                        <Stack spacing={1}>
                                            {account.transactions.slice(0, 3).map((transaction) => {
                                                const isOut =
                                                    transaction.transactionType === "WITHDRAWAL" ||
                                                    transaction.transactionType === "TRANSFER";

                                                return (
                                                    <Paper
                                                        key={transaction.id}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                                            backgroundColor: (t) => alpha(t.palette.background.default, 0.25),
                                                        }}
                                                    >
                                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                                                            <Box sx={{ minWidth: 0 }}>
                                                                <Typography sx={{ fontWeight: 800 }}>
                                                                    {transaction.transactionType}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {new Date(transaction.transactionDate).toLocaleString()}
                                                                </Typography>
                                                            </Box>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 900,
                                                                    color: (t) =>
                                                                        isOut ? t.palette.error.light : t.palette.success.light,
                                                                }}
                                                            >
                                                                {isOut ? "-" : "+"}
                                                                {account.currency} {Math.abs(transaction.amount).toFixed(2)}
                                                            </Typography>
                                                        </Stack>

                                                        {transaction.description ? (
                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                {transaction.description}
                                                            </Typography>
                                                        ) : null}

                                                        {transaction.sourceAccount && transaction.destinationAccount ? (
                                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
                                                                From: {transaction.sourceAccount} → To: {transaction.destinationAccount}
                                                            </Typography>
                                                        ) : null}
                                                    </Paper>
                                                );
                                            })}
                                        </Stack>
                                    ) : (
                                        <Typography color="text.secondary">No transactions found.</Typography>
                                    )}
                                </Paper>
                            ))}
                        </Stack>
                    ) : (
                        <Typography color="text.secondary">No accounts found.</Typography>
                    )}
                </Box>
            </Stack>
        </PageLayout>
    );

}

export default Profile;