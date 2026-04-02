import { useCallback, useEffect, useState } from "react";
import { apiService } from "../services/api";
import PageLayout from "../components/PageLayout";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";



const Transactions = () => {


    const [transactions, setTransactions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [userAccounts, setUserAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        pageSize: 2,
        totalItems: 0
    });

    useEffect(() => {
        const fetchUserAccounts = async () => {
            try {
                const response = await apiService.getMyAccounts();
                if (response.data.statusCode === 200) {
                    setUserAccounts(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedAccount(response.data.data[0].accountNumber);
                    }
                }

            } catch (error) {
                console.log(error)
            }
        }

        fetchUserAccounts();
    }, [])


    const fetchTransactions = useCallback(async (accountNumber, page) => {

        setLoading(true);
        setError('');

        try {
            const response = await apiService.getTransactions(accountNumber, page, pagination.pageSize);
            if (response.data.statusCode === 200) {
                setTransactions(response.data.data);
                setPagination({
                    currentPage: response.data.meta.currentPage,
                    totalPages: response.data.meta.totalPages,
                    pageSize: response.data.meta.pageSize,
                    totalItems: response.data.meta.totalItems
                });
            } else {
                setError(response.data.message);
            }

        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred while fetching transactions');

        } finally {
            setLoading(false)
        }
    }, [pagination.pageSize]);



    useEffect(() => {

        if (selectedAccount) {
            fetchTransactions(selectedAccount, 0);
        }

    }, [selectedAccount, fetchTransactions]);


    const handleAccountChange = (e) => {
        setSelectedAccount(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            fetchTransactions(selectedAccount, newPage);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatAmount = (amount, type, destinationAccount) => {
        let sign = '-';

        if (type === 'DEPOSIT') {
            sign = '+';
        }
        else if (type === 'TRANSFER' && destinationAccount === selectedAccount) {
            sign = '+';
        }

        return `${sign}$${Math.abs(amount).toFixed(2)}`;
    };




    return (
        <PageLayout
            title="Transactions"
            subtitle="View your transaction history"
            maxWidth="lg"
        >
            <Stack spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    select
                    label="Account"
                    value={selectedAccount}
                    onChange={handleAccountChange}
                    disabled={loading}
                    helperText={userAccounts.length ? " " : "No accounts found"}
                >
                    {userAccounts.map((account) => (
                        <MenuItem key={account.id} value={account.accountNumber}>
                            {account.accountNumber} — {account.accountType}
                        </MenuItem>
                    ))}
                </TextField>

                {loading ? (
                    <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper
                        variant="outlined"
                        sx={{
                            borderRadius: 3,
                            borderColor: (t) => alpha(t.palette.common.white, 0.08),
                            backgroundColor: (t) => alpha(t.palette.background.paper, 0.68),
                            overflow: "hidden",
                        }}
                    >
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }} align="right">Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Description</TableCell>
                                        <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <Typography color="text.secondary">
                                                    No transactions found for this account.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((transaction) => {
                                            const amountText = formatAmount(
                                                transaction.amount,
                                                transaction.transactionType,
                                                transaction.destinationAccount
                                            );
                                            const isPositive = amountText.startsWith("+");

                                            return (
                                                <TableRow key={transaction.id} hover>
                                                    <TableCell>
                                                        <Typography sx={{ fontWeight: 800 }}>
                                                            {transaction.transactionType}
                                                        </Typography>
                                                        {transaction.sourceAccount && transaction.destinationAccount ? (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {transaction.sourceAccount} → {transaction.destinationAccount}
                                                            </Typography>
                                                        ) : null}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 900,
                                                                color: (t) =>
                                                                    isPositive ? t.palette.success.light : t.palette.error.light,
                                                            }}
                                                        >
                                                            {amountText}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="text.secondary">
                                                            {formatDate(transaction.transactionDate)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
                                                            {transaction.description}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip size="small" label={transaction.status} variant="outlined" />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

                {pagination.totalPages > 0 && (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 0}
                        >
                            Previous
                        </Button>
                        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
                            Page {pagination.currentPage + 1} of {pagination.totalPages}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages - 1}
                        >
                            Next
                        </Button>
                    </Stack>
                )}
            </Stack>
        </PageLayout>
    )


}

export default Transactions;