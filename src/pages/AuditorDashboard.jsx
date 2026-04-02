import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import PageLayout from "../components/PageLayout";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";



const AuditorDashboard = () => {


    const [systemTotals, setSystemTotals] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [accountTransactions, setAccountTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [userEmail, setUserEmail] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        loadSystemTotals();
    }, []);


    const loadSystemTotals = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await apiService.getSystemTotals();
            if (response.data) {
                setSystemTotals(response.data);
            }
        } catch (err) {
            setError('Failed to load system totals');
            console.error('Error loading system totals:', err);
        } finally {
            setLoading(false);
        }
    };



    const searchUser = async () => {
        if (!userEmail.trim()) {
            setError('Please enter an email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiService.findUserByEmail(userEmail.trim());
            if (response.data) {
                setSelectedUser(response.data);
                setActiveTab('user');
            } else {
                setError('User not found');
            }
        } catch (err) {
            setError('User not found or error loading user data');
            console.error('Error loading user:', err);
        } finally {
            setLoading(false);
        }
    };


    const searchAccount = async () => {
        if (!accountNumber.trim()) {
            setError('Please enter an account number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiService.findAccountByAccountNumber(accountNumber.trim());
            if (response.data) {
                setSelectedAccount(response.data);
                setActiveTab('account');
            } else {
                setError('Account not found');
            }
        } catch (err) {
            setError('Account not found or error loading account data');
            console.error('Error loading account:', err);
        } finally {
            setLoading(false);
        }
    };




    const loadAccountTransactions = async (accountNum) => {
        setLoading(true);
        setError('');

        try {
            const response = await apiService.getTransactionsByAccountNumber(accountNum);
            if (response.data) {
                setAccountTransactions(response.data);
                setActiveTab('transactions');
            } else {
                setError('No transactions found');
            }
        } catch (err) {
            setError('Error loading transactions');
            console.error('Error loading transactions:', err);
        } finally {
            setLoading(false);
        }
    };



    const searchTransaction = async () => {
        const id = parseInt(transactionId, 10);
        if (isNaN(id) || id <= 0) {
            setError('Please enter a valid transaction ID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiService.getTransactionById(id);
            if (response.data) {
                setSelectedTransaction(response.data);
                setActiveTab('transaction');
            } else {
                setError('Transaction not found');
            }
        } catch (err) {
            setError('Transaction not found or error loading transaction data');
            console.error('Error loading transaction:', err);
        } finally {
            setLoading(false);
        }
    };


    const clearSearch = () => {
        setSelectedUser(null);
        setSelectedAccount(null);
        setAccountTransactions([]);
        setSelectedTransaction(null);
        setUserEmail('');
        setAccountNumber('');
        setTransactionId('');
        setError('');
        setActiveTab('overview');
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



    return (
        <PageLayout
            title="Auditor dashboard"
            subtitle="Search users, accounts, and transactions"
            maxWidth="lg"
            actions={
                <Button variant="outlined" onClick={clearSearch}>
                    Clear search
                </Button>
            }
        >
            <Stack spacing={2.25}>
                {error && <Alert severity="error">{error}</Alert>}
                {loading && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <CircularProgress size={18} />
                        <Typography color="text.secondary">Loading…</Typography>
                    </Box>
                )}

                <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    sx={{
                        "& .MuiTab-root": { textTransform: "none", fontWeight: 800 },
                        borderBottom: (t) => `1px solid ${alpha(t.palette.common.white, 0.08)}`,
                    }}
                >
                    <Tab value="overview" label="Overview" />
                    <Tab value="search" label="Search" />
                    <Tab value="user" label="User details" disabled={!selectedUser} />
                    <Tab value="account" label="Account details" disabled={!selectedAccount} />
                    <Tab value="transactions" label="Transactions" disabled={accountTransactions.length === 0} />
                    <Tab value="transaction" label="Transaction details" disabled={!selectedTransaction} />
                </Tabs>

                {activeTab === "overview" && (
                    <Stack spacing={2.25}>
                        <Grid container spacing={2.25}>
                            {[
                                { label: "Total users", value: systemTotals?.totalUsers || 0 },
                                { label: "Total accounts", value: systemTotals?.totalAccounts || 0 },
                                { label: "Total transactions", value: systemTotals?.totalTransactions || 0 },
                            ].map((stat) => (
                                <Grid key={stat.label} item xs={12} sm={4}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2.25,
                                            borderRadius: 3,
                                            borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                            backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                                        }}
                                    >
                                        <Typography color="text.secondary">{stat.label}</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>
                                            {stat.value}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.25,
                                borderRadius: 3,
                                borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                            }}
                        >
                            <Typography sx={{ fontWeight: 900, mb: 1 }}>Quick actions</Typography>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                                <Button variant="contained" onClick={() => setActiveTab("search")}>Search records</Button>
                                <Button variant="outlined" onClick={loadSystemTotals}>Refresh statistics</Button>
                            </Stack>
                        </Paper>
                    </Stack>
                )}

                {activeTab === "search" && (
                    <Grid container spacing={2.25}>
                        <Grid item xs={12} md={4}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.25,
                                    borderRadius: 3,
                                    borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                    backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                                }}
                            >
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>User by email</Typography>
                                <Stack spacing={1.25}>
                                    <TextField
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="Enter email"
                                        label="Email"
                                    />
                                    <Button variant="contained" onClick={searchUser}>Search user</Button>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.25,
                                    borderRadius: 3,
                                    borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                    backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                                }}
                            >
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>Account by number</Typography>
                                <Stack spacing={1.25}>
                                    <TextField
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="Enter account number"
                                        label="Account number"
                                    />
                                    <Button variant="contained" onClick={searchAccount}>Search account</Button>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.25,
                                    borderRadius: 3,
                                    borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                    backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                                }}
                            >
                                <Typography sx={{ fontWeight: 900, mb: 1 }}>Transaction by ID</Typography>
                                <Stack spacing={1.25}>
                                    <TextField
                                        type="number"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="Enter transaction ID"
                                        label="Transaction ID"
                                    />
                                    <Button variant="contained" onClick={searchTransaction}>Search transaction</Button>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {activeTab === "user" && selectedUser && (
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
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                                <Typography sx={{ fontWeight: 900 }}>User details</Typography>
                                <Chip
                                    size="small"
                                    label={selectedUser.active ? "ACTIVE" : "INACTIVE"}
                                    color={selectedUser.active ? "success" : "default"}
                                    variant={selectedUser.active ? "filled" : "outlined"}
                                />
                            </Stack>
                            <Divider sx={{ my: 1.75, opacity: 0.16 }} />

                            <Grid container spacing={1.75}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Name</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedUser.firstName} {selectedUser.lastName}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Email</Typography>
                                    <Typography sx={{ fontWeight: 700, wordBreak: "break-word" }}>{selectedUser.email}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedUser.phoneNumber}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Auth provider</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedUser.authProvider}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">Roles</Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                                        {selectedUser.roles.map((role) => (
                                            <Chip key={role.id} size="small" label={role.name} variant="outlined" />
                                        ))}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Box>
                            <Typography sx={{ fontWeight: 900, mb: 1 }}>Accounts</Typography>
                            <Stack spacing={1.5}>
                                {selectedUser.accounts.map((account) => (
                                    <Paper
                                        key={account.id}
                                        variant="outlined"
                                        sx={{
                                            p: 2.25,
                                            borderRadius: 3,
                                            borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                            backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                                        }}
                                    >
                                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                                            <Typography sx={{ fontWeight: 900 }}>
                                                {account.accountType} — {account.accountNumber}
                                            </Typography>
                                            <Chip size="small" label={account.status} variant="outlined" />
                                        </Stack>
                                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                            Balance: {formatCurrency(account.balance, account.currency)}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Created: {formatDate(account.createdAt)}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            sx={{ mt: 1.25 }}
                                            onClick={() => loadAccountTransactions(account.accountNumber)}
                                        >
                                            View transactions
                                        </Button>
                                    </Paper>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                )}

                {activeTab === "account" && selectedAccount && (
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
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                                <Typography sx={{ fontWeight: 900 }}>Account details</Typography>
                                <Chip size="small" label={selectedAccount.status} variant="outlined" />
                            </Stack>
                            <Divider sx={{ my: 1.75, opacity: 0.16 }} />

                            <Grid container spacing={1.75}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Account number</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedAccount.accountNumber}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Type</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedAccount.accountType}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Balance</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{formatCurrency(selectedAccount.balance, selectedAccount.currency)}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Created</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{formatDate(selectedAccount.createdAt)}</Typography>
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                onClick={() => loadAccountTransactions(selectedAccount.accountNumber)}
                            >
                                View all transactions
                            </Button>
                        </Paper>
                    </Stack>
                )}

                {activeTab === "transactions" && accountTransactions.length > 0 && (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2.25,
                            borderRadius: 3,
                            borderColor: (t) => alpha(t.palette.common.white, 0.08),
                            backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                        }}
                    >
                        <Typography sx={{ fontWeight: 900, mb: 1 }}>Transactions</Typography>
                        <Divider sx={{ mb: 1.5, opacity: 0.16 }} />
                        <Stack spacing={1.25}>
                            {accountTransactions.map((transaction) => (
                                <Paper
                                    key={transaction.id}
                                    variant="outlined"
                                    sx={{
                                        p: 1.75,
                                        borderRadius: 2,
                                        borderColor: (t) => alpha(t.palette.common.white, 0.08),
                                        backgroundColor: (t) => alpha(t.palette.background.default, 0.25),
                                    }}
                                >
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                                        <Typography sx={{ fontWeight: 900 }}>
                                            {transaction.transactionType} — {formatCurrency(transaction.amount)}
                                        </Typography>
                                        <Chip size="small" label={transaction.status} variant="outlined" />
                                    </Stack>
                                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                        Date: {formatDate(transaction.transactionDate)}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Description: {transaction.description}
                                    </Typography>
                                    {transaction.sourceAccount && transaction.destinationAccount ? (
                                        <Typography color="text.secondary">
                                            From: {transaction.sourceAccount} → To: {transaction.destinationAccount}
                                        </Typography>
                                    ) : null}
                                </Paper>
                            ))}
                        </Stack>
                    </Paper>
                )}

                {activeTab === "transaction" && selectedTransaction && (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2.25,
                            borderRadius: 3,
                            borderColor: (t) => alpha(t.palette.common.white, 0.08),
                            backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                        }}
                    >
                        <Typography sx={{ fontWeight: 900, mb: 1 }}>Transaction details</Typography>
                        <Divider sx={{ mb: 1.5, opacity: 0.16 }} />

                        <Grid container spacing={1.75}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">ID</Typography>
                                <Typography sx={{ fontWeight: 700 }}>{selectedTransaction.id}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">Amount</Typography>
                                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(selectedTransaction.amount)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">Type</Typography>
                                <Typography sx={{ fontWeight: 700 }}>{selectedTransaction.transactionType}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">Date</Typography>
                                <Typography sx={{ fontWeight: 700 }}>{formatDate(selectedTransaction.transactionDate)}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">Description</Typography>
                                <Typography sx={{ fontWeight: 700 }}>{selectedTransaction.description}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" color="text.secondary">Status</Typography>
                                <Chip size="small" label={selectedTransaction.status} variant="outlined" />
                            </Grid>
                            {selectedTransaction.sourceAccount ? (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Source</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedTransaction.sourceAccount}</Typography>
                                </Grid>
                            ) : null}
                            {selectedTransaction.destinationAccount ? (
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Destination</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>{selectedTransaction.destinationAccount}</Typography>
                                </Grid>
                            ) : null}
                        </Grid>
                    </Paper>
                )}
            </Stack>
        </PageLayout>
    );

}

export default AuditorDashboard;