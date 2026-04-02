import { useState } from 'react';
import { apiService } from '../services/api';
import PageLayout from "../components/PageLayout";
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    InputAdornment,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PaidOutlined, SearchOutlined } from "@mui/icons-material";




const Deposit = () => {

    const [formData, setFormData] = useState({
        accountNumber: '',
        amount: '',
        description: ''
    });


    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);

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



    const searchAccount = async () => {
        if (!formData.accountNumber.trim()) {
            setError('Please enter an account number');
            return;
        }

        setSearchLoading(true);
        setError('');
        setAccountInfo(null);

        try {

            const response = await apiService.findAccountByAccountNumber(formData.accountNumber);
            const account = response.data || [];

            if (account.accountNumber) {
                setAccountInfo(account);
                setSuccess(`Account found: ${account.accountType} Account - ${account.accountNumber}`);
                //fetch recent transactions
                fetchRecentTransactions();
            } else {
                setError(response.error);
            }
        } catch (error) {
            setError('Error searching for account' + error);
            console.error('Account search error:', error);
        } finally {
            setSearchLoading(false);
        }
    };



    const fetchRecentTransactions = async () => {
        try {
            if (formData.accountNumber) {
                const response = await apiService.getTransactions(formData.accountNumber, 0, 3);
                if (response.data.statusCode === 200) {
                    setRecentTransactions(response.data.data || []);
                }
            }
        } catch (error) {
            console.error('Error fetching recent transactions:', error);
        }
    };


    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };




    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (!formData.accountNumber.trim()) {
            setError('Account number is required');
            setLoading(false);
            return;
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount greater than 0');
            setLoading(false);
            return;
        }

        if (!formData.description.trim()) {
            setError('Description is required');
            setLoading(false);
            return;
        }

        try {
            const depositData = {
                transactionType: 'DEPOSIT',
                amount: parseFloat(formData.amount),
                accountNumber: formData.accountNumber,
                description: formData.description
            };

            const response = await apiService.makeDeposit(depositData);

            if (response.data.statusCode === 200) {
                setSuccess(`Successfully deposited $${formData.amount} to account ${formData.accountNumber}`);

                // Reset form
                setFormData({
                    accountNumber: formData.accountNumber, // Keep account number for multiple deposits
                    amount: '',
                    description: ''
                });

                // Refresh recent transactions
                fetchRecentTransactions();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccess('');
                }, 5000);
            } else {
                setError(response.data.message || 'Deposit failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during deposit');
        } finally {
            setLoading(false);
        }
    };





    return (
        <PageLayout
            title="Deposit"
            subtitle="Deposit funds into customer accounts"
            maxWidth="lg"
        >
            <Stack spacing={2.25}>
                {(error || success) && (
                    <Alert severity={error ? "error" : "success"}>{error || success}</Alert>
                )}

                <Grid container spacing={2.25}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.25,
                                borderRadius: 3,
                                borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                            }}
                        >
                            <Typography sx={{ fontWeight: 900, mb: 1 }}>Make deposit</Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={2}>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "stretch", sm: "flex-start" }}>
                                        <TextField
                                            fullWidth
                                            label="Account number"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            placeholder="Enter customer account number"
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchOutlined fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            slotProps={{
                                                htmlInput: {
                                                    onAnimationStart: handleAutoFill,
                                                },
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={searchAccount}
                                            disabled={searchLoading}
                                            sx={{ px: 2.25, py: 1.45, whiteSpace: "nowrap" }}
                                        >
                                            {searchLoading ? "Searching…" : "Verify"}
                                        </Button>
                                    </Stack>

                                    {accountInfo && (
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 1.75,
                                                borderRadius: 2,
                                                borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                                backgroundColor: (t) => alpha(t.palette.background.default, 0.25),
                                            }}
                                        >
                                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between">
                                                <Box>
                                                    <Typography sx={{ fontWeight: 900 }}>Account information</Typography>
                                                    <Typography color="text.secondary">
                                                        {accountInfo.accountType} — {formatCurrency(accountInfo.balance, accountInfo.currency)}
                                                    </Typography>
                                                </Box>
                                                <Chip size="small" label={accountInfo.status} variant="outlined" />
                                            </Stack>
                                        </Paper>
                                    )}

                                    <TextField
                                        label="Amount"
                                        name="amount"
                                        type="number"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        placeholder="0.00"
                                        inputProps={{ min: "0.01", step: "0.01" }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PaidOutlined fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        slotProps={{
                                            htmlInput: {
                                                onAnimationStart: handleAutoFill,
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="e.g., Cash deposit, Transfer from bank"
                                        required
                                        slotProps={{
                                            htmlInput: {
                                                onAnimationStart: handleAutoFill,
                                            },
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading || !accountInfo}
                                        sx={{ py: 1.15 }}
                                    >
                                        {loading ? "Processing…" : "Deposit funds"}
                                    </Button>
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Stack spacing={2.25}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.25,
                                    borderRadius: 3,
                                    borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                    backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                                }}
                            >
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>Recent deposits</Typography>
                                <Divider sx={{ mb: 1.5, opacity: 0.16 }} />
                                {recentTransactions.length > 0 ? (
                                    <Stack spacing={1}>
                                        {recentTransactions
                                            .filter((tx) => tx.transactionType === "DEPOSIT")
                                            .slice(0, 5)
                                            .map((transaction) => (
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
                                                            <Typography sx={{ fontWeight: 900 }}>DEPOSIT</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatDate(transaction.transactionDate)}
                                                            </Typography>
                                                        </Box>
                                                        <Typography sx={{ fontWeight: 900, color: (t) => t.palette.success.light }}>
                                                            +{formatCurrency(transaction.amount)}
                                                        </Typography>
                                                    </Stack>
                                                    {transaction.description ? (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                            {transaction.description}
                                                        </Typography>
                                                    ) : null}
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
                                                        Account: {transaction.sourceAccount || formData.accountNumber}
                                                    </Typography>
                                                </Paper>
                                            ))}
                                    </Stack>
                                ) : (
                                    <Typography color="text.secondary">
                                        No recent deposits found.
                                    </Typography>
                                )}
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.25,
                                    borderRadius: 3,
                                    borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                    backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                                }}
                            >
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>Deposit guidelines</Typography>
                                <Divider sx={{ mb: 1.5, opacity: 0.16 }} />
                                <Stack spacing={1}>
                                    <Typography variant="body2" color="text.secondary">• Verify account number before deposits</Typography>
                                    <Typography variant="body2" color="text.secondary">• Ensure amount is correct</Typography>
                                    <Typography variant="body2" color="text.secondary">• Provide clear description for audit</Typography>
                                    <Typography variant="body2" color="text.secondary">• Double-check info before submitting</Typography>
                                    <Typography variant="body2" color="text.secondary">• Keep records of deposit transactions</Typography>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </PageLayout>
    );

}

export default Deposit;