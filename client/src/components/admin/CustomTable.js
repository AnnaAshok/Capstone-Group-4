import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // import useNavigate

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0F3460",
    color: "#ffffff",
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

const CustomTable = (props) => {
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Track the category to delete
  const navigate = useNavigate(); // initialize navigate

  // Safeguard if categories is undefined or null
  const categories = props.categories || [];

  // Handle editing a category
  const handleEdit = (id) => {
    console.log("Edit category ID:", id);
    navigate("/admin/UpdateCategory", { state: { id } }); // Pass id via state
  };

  // Handle deleting a category
  const handleDelete = async () => {
    try {
      if (categoryToDelete) {
        const deletedCategory = await axios.post(
          `http://localhost:5000/deleteCategory/${categoryToDelete._id}`
        );
        console.log(deletedCategory);

        // Remove deleted category from the list in the parent component
        props.setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== categoryToDelete._id)
        );

        console.log("Category deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setOpenDialog(false); // Close the dialog after the action is complete
    }
  };

  // Close the confirmation dialog
  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  // Open the confirmation dialog
  const handleDialogOpen = (category) => {
    setCategoryToDelete(category); // Set the category to delete
    setOpenDialog(true); // Open the dialog
  };

  return (
    <>
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
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <StyledTableRow key={category._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{category.categoryName}</StyledTableCell>
                  <StyledTableCell>
                    <img
                      src={`http://localhost:5000/${category.categoryImage}`} 
                      alt={category.categoryName}
                      style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton color="primary" onClick={() => handleEdit(category._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDialogOpen(category)}>
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={4}>No categories available</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="warning" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomTable;
