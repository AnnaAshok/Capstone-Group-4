import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0F3460',
        color: '#ffffff',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const PaymentList = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getAllPayments');
            console.log(response)
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    return (
        <main className="main-container">
            <div className='list-payments'>
                <h3>List of Payments</h3>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>User Email</StyledTableCell>
                            <StyledTableCell>Amount</StyledTableCell>
                            <StyledTableCell>Currency</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.length > 0 ? (
                            payments.map((payment, index) => (
                                <StyledTableRow key={payment._id}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{payment.email}</StyledTableCell>
                                    <StyledTableCell>${payment.amount.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell>{payment.currency.toUpperCase()}</StyledTableCell>
                                    <StyledTableCell>
                                        <span className={`badge ${getStatusClass(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={5} className="text-center">
                                    No Payments Available
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    );
};

// Helper function for status styling
const getStatusClass = (status) => {
    switch (status) {
        case "successful": return "bg-success text-white";
        case "pending": return "bg-warning text-dark";
        case "failed": return "bg-danger text-white";
        default: return "bg-secondary text-white";
    }
};

export default PaymentList;
