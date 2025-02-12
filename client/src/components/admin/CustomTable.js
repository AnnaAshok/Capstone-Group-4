import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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


const CustomTable = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
          .post("http://localhost:5000/getCategory")
          .then((response) => {
            setCategories(response.data);
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
          });
      }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Id</StyledTableCell>
            <StyledTableCell>Category Name</StyledTableCell>
            <StyledTableCell>Category Image</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {categories.map((category,index) => (
            <StyledTableRow key={category._id}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>{category.categoryName}</StyledTableCell>
              <StyledTableCell>
                <img
                  src={category.categoryImage}
                  alt={category.categoryName}
                  style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                />
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CustomTable