import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

      const handleEdit = (id) => {
        console.log("Edit category:", id);
      };
    
      const handleDelete = (id) => {
        console.log("Delete category:", id);
      };
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
              <StyledTableCell>
              <IconButton color="primary" onClick={() => handleEdit(category._id)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(category._id)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CustomTable