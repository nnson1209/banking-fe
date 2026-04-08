import { useCallback, useEffect, useState } from "react";
import { apiService } from '../services/api';
import PageLayout from "../components/PageLayout";
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AccountBalanceOutlined, CheckCircleOutline, InfoOutlined, PaidOutlined, SearchOutlined } from "@mui/icons-material";




const Transfer = () => {

    const [formData, setFormData] = useState({
        amount: '',
        accountNumber: '',
        destinationAccountNumber: '',
        description: ''
    });


    const [userAccounts, setUserAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [destinationAccountInfo, setDestinationAccountInfo] = useState(null);
    const [verifyingAccount, setVerifyingAccount] = useState(false);


    const fetchUserAccounts = useCallback(async (preferredAccountNumber = "") => {
        try {
            const response = await apiService.getMyAccounts();

            if (response.data.statusCode === 200) {
                const accounts = response.data.data || [];
                setUserAccounts(accounts);

                setFormData((prev) => {
                    if (accounts.length === 0) {
                        return {
                            ...prev,
                            accountNumber: "",
                        };
                    }

                    const hasPreferredAccount = preferredAccountNumber
                        && accounts.some((account) => account.accountNumber === preferredAccountNumber);
                    const hasCurrentAccount = prev.accountNumber
                        && accounts.some((account) => account.accountNumber === prev.accountNumber);

                    return {
                        ...prev,
                        accountNumber: hasPreferredAccount
                            ? preferredAccountNumber
                            : hasCurrentAccount
                                ? prev.accountNumber
                                : accounts[0].accountNumber,
                    };
                });
            }

        } catch (error) {
            console.log(error)
        }
    }, []);


    useEffect(() => {
        fetchUserAccounts()
    }, [fetchUserAccounts]);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };



    const verifyDestinationAccount = async () => {
        if (!formData.destinationAccountNumber.trim()) {
            setError('Please enter a destination account number');
            return;
        }

        if (formData.accountNumber === formData.destinationAccountNumber) {
            setError('Source and destination accounts cannot be the same');
            return;
        }

        setVerifyingAccount(true);
        setError('');
        setDestinationAccountInfo(null);

        try {

            const response = await apiService.findAccountByAccountNumber(formData.destinationAccountNumber);
            const account = response.data || [];

            if (account.accountNumber) {
                setDestinationAccountInfo(account);
                setSuccess(`Account verified: ${account.accountType} Account`);
            } else {
                setError('Destination account not found. Please check the account number.');
            }
        } catch (error) {
            setError('Error verifying destination account ', error);
            console.error('Account verification error:', error);
        } finally {
            setVerifyingAccount(false);
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate form
        if (!formData.amount || !formData.destinationAccountNumber) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (parseFloat(formData.amount) <= 0) {
            setError('Amount must be greater than 0');
            setLoading(false);
            return;
        }

        if (formData.accountNumber === formData.destinationAccountNumber) {
            setError('Source and destination accounts cannot be the same');
            setLoading(false);
            return;
        }


        // Check if destination account is verified
        if (!destinationAccountInfo) {
            setError('Please verify the destination account before transferring');
            setLoading(false);
            return;
        }


        // Check if source account has sufficient balance
        const sourceAccount = userAccounts.find(acc => acc.accountNumber === formData.accountNumber);
        if (sourceAccount && parseFloat(formData.amount) > sourceAccount.balance) {
            setError('Insufficient balance in source account');
            setLoading(false);
            return;
        }


        try {
            const sourceAccountNumber = formData.accountNumber;

            const transferData = {
                transactionType: 'TRANSFER',
                amount: parseFloat(formData.amount),
                accountNumber: formData.accountNumber,
                destinationAccountNumber: formData.destinationAccountNumber,
                description: formData.description || null
            }

            const response = await apiService.makeTransfer(transferData);


            if (response.data.statusCode === 200) {
                setSuccess('Transfer completed successfully!');

                // Reset form
                setFormData((prev) => ({
                    ...prev,
                    amount: '',
                    destinationAccountNumber: '',
                    description: '',
                }));


                setDestinationAccountInfo(null);
                await fetchUserAccounts(sourceAccountNumber);
            } else {
                setError(response.data.message || 'Transfer failed');
            }

        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during transfer');

        } finally {

            setLoading(false);
        }
    }

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };





    return (
        <PageLayout
            title="Transfer"
            subtitle="Send money between accounts"
            maxWidth="lg"
        >
            <Box
                sx={{
                    width: "100%",
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.45fr) minmax(0, 1fr)" },
                    alignItems: "stretch",
                }}
            >
                <Box sx={{ display: "flex" }}>
                    <Paper
                        variant="outlined"
                        sx={{
                            width: "100%",
                            height: "100%",
                            p: 2,
                            borderRadius: 3,
                            borderColor: (t) => alpha(t.palette.common.white, 0.08),
                            backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                        }}
                    >
                        <Stack spacing={2}>
                            {(error || success) && (
                                <Alert severity={error ? "error" : "success"}>
                                    {error || success}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={2}>
                                    <TextField
                                        select
                                        label="From account"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountBalanceOutlined fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    >
                                        {userAccounts.map((account) => (
                                            <MenuItem key={account.id} value={account.accountNumber}>
                                                {account.accountNumber} — {account.accountType} ({account.currency} {account.balance.toFixed(2)})
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={1.25}
                                        alignItems={{ xs: "stretch", sm: "center" }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Destination account"
                                            name="destinationAccountNumber"
                                            value={formData.destinationAccountNumber}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter destination account number"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchOutlined fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={verifyDestinationAccount}
                                            disabled={verifyingAccount || !formData.destinationAccountNumber}
                                            sx={{
                                                whiteSpace: "nowrap",
                                                height: 56,
                                                minWidth: { xs: "100%", sm: 124 },
                                                px: 2.25,
                                            }}
                                        >
                                            {verifyingAccount ? "Verifying…" : "Verify"}
                                        </Button>
                                    </Stack>

                                    {destinationAccountInfo && (
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 1.75,
                                                borderRadius: 2,
                                                borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                                backgroundColor: (t) => alpha(t.palette.background.default, 0.25),
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                                                <CheckCircleOutline fontSize="small" />
                                                <Typography sx={{ fontWeight: 900 }}>Destination verified</Typography>
                                            </Stack>
                                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between">
                                                <Typography color="text.secondary">
                                                    {destinationAccountInfo.accountType} — {destinationAccountInfo.accountNumber}
                                                </Typography>
                                                <Chip size="small" label={destinationAccountInfo.status} variant="outlined" />
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
                                        inputProps={{ min: "0.01", step: "0.01" }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PaidOutlined fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        helperText={
                                            formData.amount
                                                ? `Available: ${formatCurrency(
                                                    userAccounts.find((acc) => acc.accountNumber === formData.accountNumber)?.balance || 0
                                                )}`
                                                : " "
                                        }
                                    />

                                    <TextField
                                        label="Description (optional)"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Optional description"
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={{ py: 1.15 }}
                                    >
                                        {loading ? "Processing…" : "Transfer money"}
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </Paper>
                </Box>

                <Box sx={{ display: "flex" }}>
                    <Paper
                        variant="outlined"
                        sx={{
                            width: "100%",
                            height: "100%",
                            p: 2,
                            borderRadius: 3,
                            borderColor: (t) => alpha(t.palette.common.white, 0.08),
                            backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <InfoOutlined fontSize="small" />
                            <Typography sx={{ fontWeight: 900 }}>Transfer guidelines</Typography>
                        </Stack>
                        <Divider
                            sx={{
                                mb: 1.35,
                                opacity: 0.82,
                                borderColor: (t) => alpha(t.palette.common.white, 0.24),
                            }}
                        />
                        <Stack spacing={0.9}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>• Transfers are processed instantly</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>• Verify the destination account number</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>• Double-check the amount before confirming</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>• Transfers cannot be reversed once processed</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>• Contact support if you encounter issues</Typography>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </PageLayout>
    );


}

export default Transfer;